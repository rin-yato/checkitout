import { customAlphabet } from "nanoid";

const CUSTOM_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghigklmnopqrrstuvwxyz0123456789";

export const nanoid = customAlphabet(CUSTOM_CHARACTERS, 16);

export function genId(prefix?: string, size = 14) {
  return [prefix, nanoid(size)].filter(Boolean).join("_");
}
