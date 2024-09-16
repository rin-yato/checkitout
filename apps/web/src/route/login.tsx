import { BrandGoogle } from "@/component/icon/google";
import { env } from "@/lib/env";
import { Avatar, Button, Em, Heading, Link, Text } from "@radix-ui/themes";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const fallbackRedirect = "/" as const;

export const Route = createFileRoute("/login")({
  component: LoginPage,
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth._tag === "AUTHENTICATED") {
      throw redirect({ to: search.redirect || fallbackRedirect });
    }
  },
});

export const GOOGLE_URL = new URL("/auth/google", env.VITE_API_URL).toString();

function LoginPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-x-3 p-7">
      <div className="absolute top-7 left-7 flex items-center gap-x-3">
        <Avatar
          src="/logo.png"
          fallback="MS"
          size="3"
          alt="Miracle Store Logo"
          className="rounded-4 shadow-lg"
        />
        <Heading size="6" weight="medium">
          <Em>Checkitout</Em>
        </Heading>
      </div>

      <section className="flex max-w-sm flex-col gap-y-7 pb-5">
        <Heading weight="medium" size="8" trim="end">
          Login to <Em>Checkitout</Em>
        </Heading>

        <Text className="leading-8" color="gray" size="7">
          Accept payments, trackable transactions, and callback that actually calls.
        </Text>

        <Button
          asChild
          size="3"
          color="gray"
          highContrast
          variant="classic"
          className="group mt-1 w-full"
        >
          <a href={GOOGLE_URL}>
            <BrandGoogle className="brightness-125" />
            <span className="font-semibold">Continue with Google</span>
          </a>
        </Button>

        <Text className="leading-3" color="gray" size="2">
          By continuing, you acknowledge that you have read and agree to our&nbsp;
          <Link href="https://www.youtube.com/watch?v=xvFZjo5PgG0">Terms of Service</Link>
          &nbsp;and&nbsp;
          <Link href="https://www.youtube.com/watch?v=xvFZjo5PgG0">Privacy Policy</Link>.
        </Text>
      </section>
    </main>
  );
}
