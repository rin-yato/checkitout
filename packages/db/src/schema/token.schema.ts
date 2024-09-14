import type { z } from "zod";
import { TB_token } from "../table";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const tokenSchema = createSelectSchema(TB_token);
export const tokenInsert = createInsertSchema(TB_token);

export type Token = z.infer<typeof tokenSchema>;
export type TokenInsert = z.infer<typeof tokenInsert>;
