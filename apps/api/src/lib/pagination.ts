import { z } from "zod";

export const paginationSchema = z.object({
  page: z
    .string({ coerce: true })
    .transform((c) => {
      const number = Number.parseInt(c, 10);
      const isValid = Number.isInteger(number) && number >= 1;

      if (!isValid) return 1;
      return number;
    })
    .openapi({
      type: "number",
      default: "1",
    }),
  perPage: z
    .string({ coerce: true })
    .transform((c) => {
      const number = Number.parseInt(c, 10);
      const isValid = Number.isInteger(number) && number >= 1;

      if (!isValid) return 10;
      return number;
    })
    .openapi({
      type: "number",
      default: "10",
    }),
});
