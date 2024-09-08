import { z } from "zod";
import { TB_user } from "../table";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const userSchema = createSelectSchema(TB_user);

export const userInsertSchema = createInsertSchema(TB_user, {
  email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;
export type UserInsert = z.infer<typeof userInsertSchema>;
