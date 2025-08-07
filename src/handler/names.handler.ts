import archiver from "archiver";
import Docxtemplater from "docxtemplater";
import { Request, Response } from "express";
import fs from "fs";
import libre from "libreoffice-convert";
import path from "path";
import PizZip from "pizzip";
import z from "zod/v4";
import { FormSchema, FormType } from "../schema/schema";
import { formatDate, getDatesInMonth } from "../utils/date";
import { TemplateData } from "../utils/template";

const templatePath = "template_frequencia.docx";

export const postNamesHandler = async (req: Request, res: Response) => {
  try {
    const result = FormSchema.safeParse(req.body);

    if (!result.success) {
      throw result.error;
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      `'attachment; filename="documents.zip"'`
    );

    const data: FormType = result.data;

    //get the days of the month
    const dates = getDatesInMonth(data.date.year, data.date.month - 1);
    // format the month name
    const monthName = dates[0].toLocaleString("pt-BR", { month: "long" });
    //format dates
    const formatedDates = dates.map((d) => formatDate(d));

    const content = fs.readFileSync(
      path.resolve(
        __dirname,
        path.join(__dirname, `../templates/${templatePath}`)
      ),
      "binary"
    );

    // prepare zip
    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) =>
      res.status(500).send({ message: err.message })
    );
    archive.pipe(res);

    // prepare tasks
    const tasks = data.names.map((name) => {
      return new Promise<void>((resolve, reject) => {
        const zip = new PizZip(content);

        const templateData: TemplateData = {
          dates: formatedDates,
          month: monthName.toUpperCase(),
          vc_name: name.toUpperCase(),
        };

        const doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
        });

        doc.render(templateData);

        const docxBuffer = doc.toBuffer();

        if (data.pdf) {
          libre.convert(docxBuffer, ".pdf", undefined, (err, pdfBuffer) => {
            if (err) {
              console.log("Conversion error: ", err);
              return reject(err);
            }
            archive.append(pdfBuffer, { name: `${name}.pdf` });
            resolve();
          });
        } else {
          archive.append(docxBuffer, { name: `${name}.docx` });
          resolve();
        }
      });
    });

    await Promise.all(tasks);
    await archive.finalize();
  } catch (err) {
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
