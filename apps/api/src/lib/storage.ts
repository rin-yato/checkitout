import { env } from "@/lib/env";
import { R2Storage } from "@repo/libs";

export const storage = new R2Storage({
  s3: {
    region: "auto",
    endpoint: env.R2_URL,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    },
  },
  bucket: env.R2_BUCKET,
  publicUrl: env.R2_PUBLIC_URL,
});
