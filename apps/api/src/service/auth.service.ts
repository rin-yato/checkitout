import { SESSION_COOKIE_NAME, lucia } from "@/lib/lucia";
import { err, ok } from "@justmiracle/result";
import type { OAuth2ProviderWithPKCE } from "arctic";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";

export class AuthService {
  async getOAuthTokenWithPKCE(
    provider: OAuth2ProviderWithPKCE,
    code: string,
    state: string,
    storedState: string | undefined,
    storedCodeVerifier: string | undefined,
  ) {
    if (!code || !state || !storedState || state !== storedState || !storedCodeVerifier) {
      // throw new ApiError({
      //   code: 400,
      //   message: "Invalid OAuth callback",
      //   details: "Invalid state, code, codeVerifier or cookie",
      // });
      throw new Error("Invalid OAuth callback");
    }

    const token = await provider
      .validateAuthorizationCode(code, storedCodeVerifier)
      .then(ok)
      .catch(err);

    if (token.error) {
      // throw new ApiError({
      //   code: 500,
      //   message: "Failed to validate authorization code",
      //   details: token.error,
      // });
      throw new Error("Failed to validate authorization code");
    }

    return token.value;
  }

  async createSession(c: Context, userId: string) {
    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);

    setCookie(c, SESSION_COOKIE_NAME, sessionCookie.value, sessionCookie.attributes);

    return { session, sessionCookie };
  }
}

export const authService = new AuthService();
