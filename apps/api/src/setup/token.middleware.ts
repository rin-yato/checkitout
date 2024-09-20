import type { Context } from "hono";
import type { AppEnv } from "./context";
import { tokenService } from "@/service/token.service";
import { apiError } from "@/lib/error";

function getBearerToken(token: string) {
  return token.replace("Bearer ", "");
}

export async function validateToken(c: Context<AppEnv>) {
  const authorizationHeader = c.req.header("Authorization");
  if (!authorizationHeader) {
    throw apiError({
      status: 401,
      message: "Unauthorized",
      details: "Authorization header is missing",
    });
  }

  const token = getBearerToken(authorizationHeader);

  const validToken = await tokenService.findOne(token);

  if (validToken.error || !validToken.value) {
    throw apiError({
      status: 401,
      message: "Unauthorized",
      details: validToken.error,
    });
  }

  return validToken.value;
}
