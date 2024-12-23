import { z } from "zod";
import { TB_user } from "../table";

import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const userSchema = createSelectSchema(TB_user);

export const userInsertSchema = createInsertSchema(TB_user, {
  email: z.string().email(),
  displayName: z
    .string({ required_error: "Display name is required" })
    .min(2, "Display name must have at least 2 characters."),
  profile: z.string({ required_error: "Profile is required" }).url("Invalid profile URL"),
  phone: z
    .string({ required_error: "Phone number is required" })
    .regex(/^\d{7,}$/, "Phone number must be at least 7 characters"),
  address: z
    .string({ required_error: "Address is required" })
    .min(10, "Address must be at least 10 characters"),
  bakongId: z
    .string({ required_error: "Bakong ID is required" })
    .regex(/^[a-z_0-9]+@[a-z_]+$/, "Bakong ID must be in the format of `username@bankid`"),
});

export const userUpdateSchema = userInsertSchema
  .pick({
    displayName: true,
    profile: true,
    phone: true,
    address: true,
    bakongId: true,
    webhookUrl: true,
    waitBeforeRedirect: true,
  })
  .extend({
    webhookUrl: z.string().url("Invalid webhook URL"),
  })
  .partial();

export type User = z.infer<typeof userSchema>;
export type UserInsert = z.infer<typeof userInsertSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
