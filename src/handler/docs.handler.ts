import archiver from "archiver";
import Docxtemplater from "docxtemplater";
import { Request, Response } from "express";
import fs, { stat } from "fs";
import libre from "libreoffice-convert";
import path from "path";
import PizZip from "pizzip";
import z from "zod/v4";
import { FormSchema, FormType } from "../schema/schema";
import { formatDate, getDatesInMonth } from "../utils/date";
import pLimit from "p-limit";
import { logger } from "../utils/logger";
import { generateRequestId } from "../utils/request";

function getTemplateAbsPath() {
  return path.resolve(__dirname, "../templates", "template_frequencia.docx");
}

type CacheKey = string; // e.g. `${templateAbsPath}:${year}-${month}`
const staticBufferCache = new Map<CacheKey, { mtimeMs: number; buf: Buffer }>();

function getStaticPrefilledBuffer(
  key: CacheKey,
  month: string,
  dates: ReturnType<typeof formatDate>[]
) {
  const abs = getTemplateAbsPath();
  const { mtimeMs } = fs.statSync(abs);
  const cached = staticBufferCache.get(key);
  if (cached && cached.mtimeMs === mtimeMs) {
    logger.debug("Using cached template buffer", { key, month });
    return cached.buf;
  }

  logger.info("Regenerating template buffer", {
    key,
    month,
    templatePath: abs,
  });
  const content = fs.readFileSync(abs, "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.render({ month, dates, vc_name: "{vc_name}" });
  const buf = doc.toBuffer();
  staticBufferCache.set(key, { mtimeMs, buf });
  logger.debug("Template buffer cached", {
    key,
    month,
    bufferSize: buf.length,
  });
  return buf;
}

const limit = pLimit(3);

const convertToPdf = (input: Buffer) =>
  new Promise<Buffer>((resolve, reject) => {
    libre.convert(input, ".pdf", undefined, (err, buf) =>
      err ? reject(err) : resolve(buf)
    );
  });

export const docsCreationHandler = async (req: Request, res: Response) => {
  const requestId = generateRequestId();
  logger.info("Document generation started", {
    requestId,
    namesCount: req.body.names?.length,
    month: req.body.date?.month,
    year: req.body.date?.year,
    outputFormat: req.body.pdf ? "PDF" : "DOCX",
  });

  try {
    const result = FormSchema.safeParse(req.body);

    if (!result.success) {
      throw result.error;
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="documents.zip"'
    );

    const data: FormType = result.data;

    const dates = getDatesInMonth(data.date.year, data.date.month - 1);
    const monthName = dates[0]
      .toLocaleString("pt-BR", { month: "long" })
      .toUpperCase();
    const formatedDates = dates.map(formatDate);

    const cacheKey = `${getTemplateAbsPath()}:${data.date.year}-${
      data.date.month
    }`;
    const prefilledBuffer = getStaticPrefilledBuffer(
      cacheKey,
      monthName,
      formatedDates
    );

    // prepare zip stream
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) =>
      res.status(500).send({ message: err.message })
    );
    archive.pipe(res);

    // prepare tasks
    const tasks = data.names.map((name) =>
      limit(async () => {
        const startTime = Date.now();
        const zipPerName = new PizZip(prefilledBuffer);
        const docPerName = new Docxtemplater(zipPerName, {
          paragraphLoop: true,
          linebreaks: true,
        });
        docPerName.render({ vc_name: name.toUpperCase() });
        const docxBuffer = docPerName.toBuffer();
        const docName = name.replaceAll(" ", "_");

        if (data.pdf) {
          const pdfBuffer = await convertToPdf(docxBuffer);
          archive.append(pdfBuffer, { name: `${docName}.pdf` });
        } else {
          archive.append(docxBuffer, { name: `${docName}.docx` });
        }
        logger.debug("Document generated successfully", {
          name,
          duration: Date.now() - startTime,
          format: data.pdf ? "PDF" : "DOCX",
        });
      })
    );

    await Promise.all(tasks);
    await archive.finalize();
    logger.info("Document generation completed", {
      requestId,
      documentsGenerated: data.names.length,
      archiveSize: archive.pointer(), // if available
    });
  } catch (err) {
    const error = err as Error;
    logger.error("Document generation failed", {
      requestId,
      error: error.message,
      stack: error.stack,
    });
    if (err instanceof z.ZodError) {
      console.warn(err);
      res.status(400).json({
        errors: err.issues.map((iss) => ({
          field: iss.path.join("."),
          message: iss.message,
        })),
      });
      return;
    }
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
