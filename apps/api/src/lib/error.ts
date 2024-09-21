import type { NamedError } from "@/constant/error";
import type { StatusCode } from "hono/utils/http-status";

export function apiError(opts: {
  name?: NamedError;
  status: StatusCode;
  message: string;
  details?: unknown;
}): ApiError {
  return new ApiError({ ...opts, name: opts.name ?? "DEFAULT" });
}

export class ApiError extends Error {
  _tag = "ApiError";
  status: StatusCode;
  message: string;
  details?: unknown;
  name: NamedError;

  constructor({
    name,
    status,
    message,
    details,
  }: {
    name: NamedError;
    status: StatusCode;
    message: string;
    details?: unknown;
  }) {
    super(message);
    this.name = name;
    this.status = status;
    this.message = message;
    this.details = details;
  }
}
