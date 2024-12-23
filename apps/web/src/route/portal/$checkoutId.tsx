import ky from "ky";
import { env } from "@/lib/env";
import { QRPay } from "./-component/qr";
import { Flex, Theme } from "@radix-ui/themes";
import { Invoice } from "./-component/invoice";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, CornersOut, PiggyBank } from "@phosphor-icons/react";
import type { CheckoutPortalV1Response } from "@repo/schema";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/portal/$checkoutId")({
  component: CheckoutPage,
  pendingComponent: () => <div className="flex-1 bg-gray-2" />,
  beforeLoad: ({ context, params }) => {
    const opts = queryOptions({
      queryKey: ["@checkout", params.checkoutId, "portal"],
      queryFn: async () => {
        return ky
          .get(`v1/checkout/portal/${params.checkoutId}`, {
            retry: 0,
            prefixUrl: env.VITE_API_URL,
          })
          .json<CheckoutPortalV1Response>();
      },
    });

    return context.queryClient.ensureQueryData(opts);
  },
});

function CheckoutPage() {
  const { checkoutId } = Route.useParams();

  const [isProcessing, setIsProcessing] = useState(false);

  const firstDataLoad = useRef({ loaded: false, isProcessing: false });
  const toastIdRef = useRef<string | number>("");

  const { data, isPending, error } = useQuery({
    queryKey: ["@checkout", checkoutId, "portal"],
    queryFn: () => {
      return ky
        .get(`v1/checkout/portal/${checkoutId}`, { retry: 0, prefixUrl: env.VITE_API_URL })
        .json<CheckoutPortalV1Response>();
    },
    retry: false,
    refetchInterval: (query) =>
      query.state.status === "error" || query.state?.data?.hasSuccessfulWebhook ? false : 2869,
  });

  useEffect(() => {
    if (!data) return;

    // If it's the first data load, and the transaction is successful but
    // the webhook hasn't been received yet, we should show the processing state.
    if (
      !firstDataLoad.current.loaded &&
      data.hasSuccessfulTransaction &&
      !data.hasSuccessfulWebhook
    ) {
      setIsProcessing(true);
      firstDataLoad.current = { loaded: true, isProcessing: true };
    }

    // We dont show the toast, if we are already in the processing state
    if (
      firstDataLoad.current.loaded &&
      !firstDataLoad.current.isProcessing &&
      data.hasSuccessfulTransaction &&
      !toastIdRef.current
    ) {
      toastIdRef.current = toast.loading("Hold on tight! We're processing your payment.");

      setTimeout(() => {
        if (data.hasSuccessfulWebhook && data.hasSuccessfulTransaction) return;

        toast.error("Unable to process your payment.", {
          id: toastIdRef.current,
          duration: 10_000, // 10s
        });
        setIsProcessing(true);
      }, 25_000); // 35s
    }

    if (
      firstDataLoad.current.loaded && // first load we dont redirect
      data.hasSuccessfulWebhook &&
      data.hasSuccessfulTransaction &&
      data.checkout.redirectUrl
    ) {
      const redirectUrl = data.checkout.redirectUrl;
      const validURL = URL.canParse(redirectUrl);
      const delay = 3300;

      toast.success("Payment successful!", {
        id: toastIdRef.current,
        description: "Your payment has been successfully processed.",
      });

      if (validURL) {
        setTimeout(() => window.location.assign(redirectUrl), delay);
        return;
      }

      if (window.history.length > 1) {
        setTimeout(() => window.history.back(), delay);
        return;
      }
    }

    firstDataLoad.current = { loaded: true, isProcessing: firstDataLoad.current.isProcessing };
  }, [data]);

  if (isPending) {
    return <div className="h-dvh w-full bg-gray-2" />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Theme asChild appearance="light">
      <main className="flex flex-1 overflow-x-hidden border bg-gray-2 p-5 sm:p-10">
        <Flex className="mx-auto flex-1 flex-wrap-reverse justify-center gap-12 overflow-x-hidden">
          <Flex className="fade-in-0 animate-in">
            <Invoice user={data.user} checkout={data.checkout} />
          </Flex>

          <Flex direction="column" className="fade-in-0 animate-in max-sm:flex-1">
            <QRPay
              paid={data.hasSuccessfulTransaction}
              processing={isProcessing}
              currency={data.checkout.currency}
              amount={data.checkout.total}
              merchantName={data.user.displayName}
              qrCode={data.activeTransaction?.qrCode ?? ""}
              checkoutId={data.checkout.id}
            />

            {/* Step by step guide for scanning QR code and paying with Bakong KHQR */}
            <Flex className="mt-8 flex-col gap-3 px-1 text-gray-foreground">
              <div className="flex items-center gap-3">
                <div className="w-fit rounded-4 border bg-background p-1.5">
                  <PiggyBank size="20" />
                </div>
                <div>1. Open your banking app</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-fit rounded-4 border bg-background p-1.5">
                  <CornersOut size="20" />
                </div>
                <div>2. Scan the QR code with your banking app</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-fit rounded-4 border bg-background p-1.5">
                  <Check size="20" />
                </div>
                <div>3. Confirm the payment and Tada! 🎉</div>
              </div>
            </Flex>
          </Flex>
        </Flex>
      </main>
    </Theme>
  );
}
