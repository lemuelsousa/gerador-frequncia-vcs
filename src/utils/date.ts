const LOCALE = "pt-BR";

export function getDatesInMonth(year: number, month: number) {
  const dates = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}

export function formatDate(date: Date) {
  return {
    month: date.toLocaleString(LOCALE, { month: "long" }),
    date: new Intl.DateTimeFormat(LOCALE, {
      dateStyle: "short",
    }).format(date),
    weekday: date.toLocaleDateString(LOCALE, { weekday: "short" }),
  };
}
