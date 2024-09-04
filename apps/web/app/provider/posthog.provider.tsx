// import { env } from "@/lib/env";
// import posthog from "posthog-js";
// import { PostHogProvider as BasePostHogProvider } from "posthog-js/react";
// import type {
//   // useEffect,
//   PropsWithChildren,
// } from "react";
// // import { usePathname, useSearchParams } from 'next/navigation';

// if (typeof window !== "undefined") {
//   posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
//     api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
//     loaded: () => {
//       if (env.NODE_ENV !== "production") posthog.debug();
//     },
//     capture_pageleave: false,
//     capture_pageview: false,
//     autocapture: false,
//     session_recording: { maskAllInputs: false, maskInputOptions: { password: true } },
//     disable_session_recording: true,
//     person_profiles: "identified_only",
//     debug: env.NODE_ENV !== "production",
//   });
// }

// export function PostHogProvider(props: PropsWithChildren) {
//   // const pathname = usePathname();
//   // const searchParams = useSearchParams();

//   // useEffect(() => {
//   //     if (!pathname || !posthog) return;

//   //     const url = new URL(pathname, window.origin);
//   //     url.search = searchParams.toString();

//   //     posthog.capture('$pageview', {
//   //         $current_url: url.toString(),
//   //         $referrer: document.referrer,
//   //     });
//   // }, [pathname, posthog]);

//   return <BasePostHogProvider client={posthog}>{props.children}</BasePostHogProvider>;
// }
