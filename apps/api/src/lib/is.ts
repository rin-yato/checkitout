export function isValidUrl(url?: string) {
  if (!url) return false;
  return URL.canParse(url);
}
