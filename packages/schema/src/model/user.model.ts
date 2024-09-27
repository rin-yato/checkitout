import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  googleId: z.string(),

  displayName: z.string(),
  username: z.string(),
  profile: z.string().nullable(),
  email: z.string(),
  address: z.string(),
  phone: z.string(),

  bakongId: z.string(),
  webhookUrl: z.string(),
  waitBeforeRedirect: z.boolean(),

  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable(),
});

export const publicUserSchema = userSchema.pick({
  email: true,
  phone: true,
  address: true,
  profile: true,
  displayName: true,
  waitBeforeRedirect: true,
});

export const userUpdateSchema = z.object({
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
    .regex(/^[a-z_]+@[a-z_]+$/, "Bakong ID must be in the format of `username@bankid`"),
  webhookUrl: z
    .string({ required_error: "Webhook URL is required" })
    .url("Invalid webhook URL"),
  waitBeforeRedirect: z.boolean({ coerce: true }),
});

export type User = z.infer<typeof userSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
