import { env } from "@/lib/env";
import { apiError } from "@/lib/error";
import { google } from "@/lib/lucia/auth-provider";
import { authService } from "@/service/auth.service";
import { userService } from "@/service/user.service";
import { OpenAPIHono, createRoute, z } from "@hono/zod-openapi";
import { err, ok } from "@justmiracle/result";
import ky from "ky";

interface GoogleUser {
  sub: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email_verified: boolean;
}

const REDIRECT = {
  SUCCESS: new URL("/", env.WEB_URL).toString(),
  FAILURE: new URL("/login", env.WEB_URL).toString(),
};

export const googleAuthCallback = new OpenAPIHono().openapi(
  createRoute({
    method: "get",
    tags: ["Auth"],
    path: "/auth/google/callback",
    request: {
      query: z.object({ code: z.string(), state: z.string() }),
      cookies: z.object({
        google_oauth_state: z.string(),
        google_oauth_code_verifier: z.string(),
      }),
    },
    responses: { 200: { description: "Google auth callback" } },
  }),
  async (c) => {
    const { state, code } = c.req.valid("query");
    const { google_oauth_state, google_oauth_code_verifier } = c.req.valid("cookie");

    const storedState = google_oauth_state;
    const storedCodeVerifier = google_oauth_code_verifier;

    const token = await authService.getOAuthTokenWithPKCE(
      google,
      code,
      state,
      storedState,
      storedCodeVerifier,
    );

    const googleUser = await ky
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${token.accessToken}` },
      })
      .json<GoogleUser>()
      .then(ok)
      .catch(err);

    if (googleUser.error) {
      throw apiError({
        status: 500,
        message: "Unable to get the Google user data",
        details: googleUser.error,
      });
    }

    let user = await userService.findByGoogleId(googleUser.value.sub);

    if (user.error) {
      throw apiError({
        status: 500,
        message: "Something went wrong, please try again later",
        details: {
          message: "Unable to check if user already exist",
          error: user.error,
        },
      });
    }

    if (!user.value) {
      const username = googleUser.value.email.split("@")[0];

      if (!username) {
        throw apiError({
          status: 500,
          message: "Something went wrong, please try again later",
          details: {
            message: "Unable to generate username",
            email: googleUser.value.email,
          },
        });
      }

      user = await userService.create({
        username: username,
        googleId: googleUser.value.sub,
        email: googleUser.value.email,
        displayName: googleUser.value.name,
        profile: googleUser.value.picture,
      });

      if (user.error || !user.value) {
        throw apiError({
          status: 500,
          message: "Unable to create user",
          details: user.error,
        });
      }
    }

    // Create a session and set the cookie
    await authService.createSession(c, user.value.id);

    return c.redirect(REDIRECT.SUCCESS);
  },
);
