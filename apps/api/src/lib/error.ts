import type { NamedError } from "@/constant/error";
import type { StatusCode } from "hono/utils/http-status";

type ApiError = {
  _tag: "ApiError";
  name: NamedError;
  status: StatusCode;
  message: string;
  details?: unknown;
};

export function apiError(opts: {
  name?: NamedError;
  status: StatusCode;
  message: string;
  details?: unknown;
}): ApiError {
  return {
    _tag: "ApiError",
    ...opts,
    name: opts.name ?? "UNKNOWN",
  };
}

export function isApiError(e: any): e is ApiError {
  return e?._tag === "ApiError";
}
