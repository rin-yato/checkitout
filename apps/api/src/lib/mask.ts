export function maskSensitiveHeaders(headers: Record<string, string>) {
  const sensitiveHeaders = ["authorization", "cookie", "set-cookie"];

  return Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [
      key,
      sensitiveHeaders.includes(key.toLowerCase())
        ? `${value.slice(0, 2)}****${value.slice(-1)}`
        : value,
    ]),
  );
}
