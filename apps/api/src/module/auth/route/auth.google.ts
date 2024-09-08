import { env } from "@/lib/env";
import { google } from "@/lib/lucia/auth-provider";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { generateCodeVerifier, generateState } from "arctic";
import { setCookie } from "hono/cookie";

export const googleAuth = new OpenAPIHono().openapi(
  createRoute({
    method: "get",
    tags: ["Auth"],
    path: "/auth/google",
    responses: { 302: { description: "Redirect to google auth" } },
  }),
  async (c) => {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    const url = await google.createAuthorizationURL(state, codeVerifier, {
      scopes: ["openid", "email", "profile"],
    });

    setCookie(c, "google_oauth_state", state, {
      path: "/",
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "Lax",
    });

    setCookie(c, "google_oauth_code_verifier", codeVerifier, {
      path: "/",
      secure: env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "Lax",
    });

    return c.redirect(url.toString());
  },
);
