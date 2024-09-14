import { apiReference } from "@scalar/hono-api-reference";
import type { App } from "./context";
import { env } from "@/lib/env";
import { basicAuth } from "hono/basic-auth";

export function registerOpenAPI(app: App) {
  app.use("/docs/*", basicAuth({ username: "pass", password: "pog" }));

  app.doc31("/openapi", {
    openapi: "3.1.0",
    info: {
      version: "0.1.0",
      title: "Miracle Checkout",
      description: `
## Authentication

You can authenticate with **Google OAuth**.
Just click the **Authorize** button and you will be redirected to the Google OAuth page.
There is no need to fill in the \`Client ID\` or check any \`scopes\`.
`,
      contact: {
        name: "RinYato",
        url: "https://rinyato.com",
        email: "chearithorn@gmail.com",
      },
    },
  });

  app.openAPIRegistry.registerComponent("securitySchemes", "Google OAuth", {
    type: "oauth2",
    name: "GOOGLE OAUTH",
    description: "Google OAuth2",
    flows: {
      implicit: {
        authorizationUrl: `${env.API_URL}/auth/google`,
        scopes: {},
      },
    },
  });

  app.get(
    "/docs",
    apiReference({
      cdn: "https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.25.7",
      pageTitle: "Miracle Checkout",
      tagsSorter: "alpha",
      defaultHttpClient: { targetKey: "node", clientKey: "fetch" },
      authentication: {
        securitySchemes: {
          "GOOGLE OAUTH": {
            type: "oauth2",
            description: "Google OAuth2",
            flows: {
              implicit: {
                authorizationUrl: `${env.API_URL}/auth/google`,
                scopes: { "read:user": "Read user profile" },
              },
            },
          },
        },
      },
      theme: "mars",
      spec: {
        url: "/openapi",
      },
    }),
  );
}
