export const ERROR = [
  "UNKNOWN",

  // NO
  "NO_BAKONG_ID",

  // VALIDATION
  "INVALID_DATA",

  // DB
  "TAKE_FIRST_OR_THROW",
] as const;

export type NamedError = (typeof ERROR)[number];
