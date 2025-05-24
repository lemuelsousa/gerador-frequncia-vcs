import Docxtemplater from "docxtemplater";

export interface TemplateData {
  month: string;
  dates: {
    month: string;
    date: string;
    weekday: string;
  }[];
  vc_name: string;
}

export function fillTemplate(doc: Docxtemplater, tData: TemplateData) {
  doc.render(tData);
  return doc;
}
