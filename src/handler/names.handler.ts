import { Request, Response } from "express";
import { TemplateData } from "../utils/template";
import fs from "fs";
import path from "path";
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { formatDate, getDatesInMonth } from "../utils/date";

export const postNamesHandler = (req: Request, res: Response) => {
  const data = req.body;
  const names: string[] = data.names.split(",");
  const [year, mon] = data.month.split("-").map(Number);

  console.log(names, year, mon)

  const dates = getDatesInMonth(year, mon);
  const formatedDates = dates.map((d) => formatDate(d));

  const templateData: TemplateData = {
    dates: formatedDates,
    month: mon.toLocaleString("pt-BR", { month: "long" }),
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
