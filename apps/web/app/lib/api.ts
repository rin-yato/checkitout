import ky from "ky";
import { env } from "./env";

export const api = ky.extend({
  prefixUrl: env.VITE_API_URL,
  credentials: "include",
  retry: 0,
  hooks: {
    beforeError: [(error) => error.response.json()],
  },
});
