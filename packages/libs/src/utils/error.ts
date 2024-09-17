export interface ApiErrorResponse {
  code: number;
  message: string;
  details?: unknown;
}

export class ApiError extends Error {
  code: number;
  details?: unknown;

  constructor({ code, message, details }: ApiErrorResponse) {
    super(message);
    this.code = code;
    this.details = details;
  }

  toObect() {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    };
  }

  toExample() {
    return {
      code: this.code,
      message: this.message,
      details: "More details here (unknown and optional)",
    };
  }
}
