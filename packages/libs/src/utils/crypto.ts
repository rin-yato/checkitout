import * as crypto from "crypto";

export function hash(input: crypto.BinaryLike): string {
  if (!input) return "";

  const hash = crypto.createHash("md5");
  hash.update(input);
  return hash.digest("hex");
}
