import { formatDate, getDatesInMonth } from "../utils/date";

const vcNames = [
  "lemuel de sousa pereira",
  "josé gabriel monteiro pinto",
  "PEDRO HENRIQUE TAVARES MONTEIRO",
];

const datesInJune = getDatesInMonth(2025, 5);
export const dates = datesInJune.map((d) => formatDate(d));
