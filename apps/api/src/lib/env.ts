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

  PORT: z.number().default(3050),

  WEB_URL: z.string().default("http://localhost:3000"),
  API_URL: z.string().default("http://localhost:3050"),
  BASE_URL: z.string().default("localhost"),

  BAKONG_TOKEN: z.string(),

  DB_URL: z.string(),
  DB_TOKEN: z.string(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
