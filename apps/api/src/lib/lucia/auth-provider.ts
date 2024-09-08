import { env } from "@/lib/env";
import { Google } from "arctic";

export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.API_URL}/auth/google/callback`,
);
