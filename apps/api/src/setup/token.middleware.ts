import type { Context } from "hono";
import type { AppEnv } from "./context";
import { HTTPException } from "hono/http-exception";
import { tokenService } from "@/service/token.service";

function getBearerToken(token: string) {
  return token.replace("Bearer ", "");
}

export async function validateToken(c: Context<AppEnv>) {
  const authorizationHeader = c.req.header("Authorization");
  if (!authorizationHeader) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  const token = getBearerToken(authorizationHeader);

  const validToken = await tokenService.findOne(token);

  if (validToken.error || !validToken.value) {
    throw new HTTPException(401, { message: "Unauthorized" });
  }

  return validToken.value;
}
