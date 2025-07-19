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
    .string()
    .min(1, "o campo nome não pode ser vazio")
    .transform((str) => {
      return str
        .split(",")
        .map((name) => name.trim())
        .filter((name) => name.length > 0);
    })
    .refine(
      (names) => {
        return names.every(
          (name) =>
            name.length >= 2 &&
            name.length <= 100 &&
            /^[\p{L}\s]+$/u.test(name) // test if constains only letters and spaces
        );
      },
      {
        message:
          "cada nome deve ter entre 02 a 100 caracteres e conter apenas letras e espaçamentos",
      }
    )
    .refine(
      (names) => {
        const normalized = names.map((name) => name.toLowerCase().trim());
        return new Set(normalized).size === normalized.length;
      },
      {
        message: "não é possível ter nomes duplicados",
      }
    ),
  pdf: z.boolean(),
});

type FormType = z.infer<typeof FormSchema>;

export { FormType, FormSchema };
