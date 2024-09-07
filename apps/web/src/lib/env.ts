import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {},

  clientPrefix: "VITE_",

  client: {
    VITE_API_URL: z.string().url(),
    VITE_ADMIN_URL: z.string().url(),
    VITE_BASE_DOMAIN: z.string(),
    VITE_POSTHOG_KEY: z.string(),
    VITE_POSTHOG_HOST: z.string().url(),
  },

  shared: {
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },

  runtimeEnvStrict: {
    // SERVER

    // CLIENT
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_ADMIN_URL: import.meta.env.VITE_ADMIN_URL,
    VITE_BASE_DOMAIN: import.meta.env.VITE_BASE_DOMAIN,

    // POSTHOG
    VITE_POSTHOG_KEY: import.meta.env.VITE_POSTHOG_KEY,
    VITE_POSTHOG_HOST: import.meta.env.VITE_POSTHOG_HOST,

    // SHARED
    NODE_ENV: import.meta.env.NODE_ENV,
  },

  emptyStringAsUndefined: true,
});
