import { z } from "zod/v4";

const currentYear = new Date().getFullYear();

const FormSchema = z.object({
  date: z
    .string()
    .regex(
      /^\d{4}-(0[1-9]|1[0-2])$/,
      "a data dever ser no formato yyyy-mm (ex., 2025-01)"
    )
    .transform((date) => {
      const [year, month] = date.split("-");
      return {
        year: parseInt(year),
        month: parseInt(month),
      };
    })
    .refine((date) => date.year >= 2015 && date.year >= currentYear, {
      message: "o ano deve ser algum dentre 2015 e " + currentYear,
    })
    .refine((date) => date.month >= 1 && date.month <= 12, {
      message: "mês deve ser entre 01 (janeiro) e 12 (dezembro)",
    }),
  names: z
    .array(
      z
        .string()
        .trim()
        .min(2, "o nome deve conter no mínimo dois caracteres")
        .max(100, "o nome deve conter no máximo cem caracteres")
        .refine((name) => /^[\p{L}\s]+$/u.test(name), {
          message: "o nome deve conter apenas letras e espaçamentos",
        })
        .refine(
          (name) => {
            return name.split(" ").length >= 2;
          },
          {
            message: "o nome deve ser composto",
          }
        )
    )
    .min(1, "1 nome é o número mínimo")
    .max(10, "10 nomes é o número máximo"),
  pdf: z.boolean(),
});

type FormType = z.infer<typeof FormSchema>;

export { FormType, FormSchema };
