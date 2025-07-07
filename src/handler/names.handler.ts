import archiver from "archiver";
import Docxtemplater from "docxtemplater";
import { Request, Response } from "express";
import fs from "fs";
import path, { resolve } from "path";
import PizZip from "pizzip";
import { formatDate, getDatesInMonth } from "../utils/date";
import libre from "libreoffice-convert";
import { TemplateData } from "../utils/template";

const templatePath = "template_frequencia.docx";

export const postNamesHandler = async (req: Request, res: Response) => {
  const data = req.body;
  // TODO: validate data
  const pdf: string = data.pdf;
  const names: string[] = data.names.split(",");
  const [year, mon] = data.month.split("-").map(Number);

  // format data
  const dates = getDatesInMonth(year, mon - 1);
  const monthName = dates[0].toLocaleString("pt-BR", { month: "long" });
  const formatedDates = dates.map((d) => formatDate(d));

  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `'attachment; filename="documents.zip"'`
  );

  const content = fs.readFileSync(
    path.resolve(
      __dirname,
      path.join(__dirname, `../templates/${templatePath}`)
    ),
    "binary"
  );

  // prepare zip
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("error", (err) => res.status(500).send(err.message));
  archive.pipe(res);

  // prepare tasks
  const tasks = names.map((name) => {
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

      if (pdf) {
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

  try {
    await Promise.all(tasks);
    await archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating files.");
  }
};
