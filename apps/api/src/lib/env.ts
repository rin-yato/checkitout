import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.union([
    z.literal("development"),
    z.literal("production"),
    z.literal("test"),
    z.literal("stage"),
  ]),

  PORT: z.number({ coerce: true }).default(3050),

  WEB_URL: z.string(),
  API_URL: z.string(),
  BASE_URL: z.string(),

  BAKONG_TOKEN: z.string(),

  DB_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.number({ coerce: true }).default(6379),
  REDIS_PASSWORD: z.string().optional(),

  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  JWT_SECRET: z.string(),

  R2_BUCKET: z.string(),
  R2_URL: z.string(),
  R2_PUBLIC_URL: z.string(),
  R2_ACCESS_KEY: z.string(),
  R2_SECRET_ACCESS_KEY: z.string(),

  AXIOM_DATASET: z.string().optional(),
  AXIOM_TOKEN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
