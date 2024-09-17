import { customAlphabet } from "nanoid";

const CUSTOM_CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghigklmnopqrrstuvwxyz0123456789";

export const nanoid = customAlphabet(CUSTOM_CHARACTERS, 16);
