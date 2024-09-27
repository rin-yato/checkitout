export function isValidUrl(url?: string) {
  if (!url) return false;
  return URL.canParse(url);
}

export function isSuccessStatus(status: number) {
  return status >= 200 && status < 300;
}
