import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z
    .union([
      z.literal("development"),
      z.literal("production"),
      z.literal("test"),
      z.literal("stage"),
    ])
    .default("development"),

  PORT: z.number().default(3000),
});
