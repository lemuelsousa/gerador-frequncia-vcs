import archiver from "archiver";
import Docxtemplater from "docxtemplater";
import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import PizZip from "pizzip";
import { formatDate, getDatesInMonth } from "../utils/date";
import { TemplateData } from "../utils/template";

export const postNamesHandler = async (req: Request, res: Response) => {
  const data = req.body;
  // TODO: validate data
  const names: string[] = data.names.split(",");
  const [year, mon] = data.month.split("-").map(Number);

  // format data
  const dates = getDatesInMonth(year, mon);
  const monthName = dates[0].toLocaleString("pt-BR", { month: "long" });
  const formatedDates = dates.map((d) => formatDate(d));

  // set header after validate data
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `'attachment; filename="documents.zip"'`
  );

  // load docx template as binary
  const content = fs.readFileSync(
    path.resolve(
      __dirname,
      path.join(__dirname, "../templates/template_frequencia.docx")
    ),
    "binary"
  );

  // create a zip container with archiver
  const archive = archiver("zip");
  // set res as the output
  archive.pipe(res);

  names.forEach((name) => {
    const zip = new PizZip(content);

    const templateData: TemplateData = {
      dates: formatedDates,
      month: monthName,
      vc_name: name.toUpperCase(),
    };

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(templateData);
    const buf = doc.getZip().generate({ type: "nodebuffer" });
    archive.append(buf, { name: `${name}.docx` });
  });

  await archive.finalize();
};
