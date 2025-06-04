import { Request, Response } from "express";
import { TemplateData } from "../utils/template";
import fs from "fs";
import path from "path";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { dates } from "../reposiroty/repository";

export const postNamesHandler = (req: Request, res: Response) => {
  const data: string = req.body.names;
  const names = data.split(",");

  const templateData: TemplateData = {
    dates: dates,
    month: dates[0].month.toUpperCase(),
    vc_name: names[0].toUpperCase(),
  };

  const content = fs.readFileSync(
    path.resolve(
      __dirname,
      path.join(__dirname, "../templates/template_frequencia.docx")
    ),
    "binary"
  );

  const zip = new PizZip(content);

  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  try {
    doc.render(templateData);

    const buf = doc.toBuffer();
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader("Content-Disposition", "attachment; filename=generated.docx");
    res.send(buf);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};
