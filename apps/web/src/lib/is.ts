export function isOkStatus(status: number) {
  return status >= 200 && status < 300;
}
