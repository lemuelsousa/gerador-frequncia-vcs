import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import fs from "fs";
import path from "path";
import { fillTemplate, TemplateData } from "./service/template.service";
import { dates } from "./reposiroty/repository";

const content = fs.readFileSync(
  path.resolve(__dirname, "templates/template_frequencia.docx"),
  "binary"
);

const zip = new PizZip(content);

const doc = new Docxtemplater(zip, {
  paragraphLoop: true,
  linebreaks: true,
});

const templateData: TemplateData = {
  dates: dates,
  month: dates[0].month.toUpperCase(),
  vc_name: "lemuel de sousa pereira".toUpperCase(),
};

const template = fillTemplate(doc, templateData);

const buf = template.toBuffer();

fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);
console.log("frequencia gerada com sucesso.");
