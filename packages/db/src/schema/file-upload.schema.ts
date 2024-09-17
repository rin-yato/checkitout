import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { TB_fileUpload } from "../table";
import type { z } from "zod";

export const fileUploadSchema = createSelectSchema(TB_fileUpload);
export const fileUploadInsert = createInsertSchema(TB_fileUpload);

export type FileUpload = z.infer<typeof fileUploadSchema>;
export type FileUploadInsert = z.infer<typeof fileUploadInsert>;
