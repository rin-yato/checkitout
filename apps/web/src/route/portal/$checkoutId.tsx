import ky from "ky";
import { env } from "@/lib/env";
import { QRPay } from "./-component/qr";
import { Flex } from "@radix-ui/themes";
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
      queryKey: ["checkout", params.checkoutId],
      queryFn: async () => {
        return ky
          .get(`v1/checkout/portal/${params.checkoutId}`, {
            retry: 0,
            prefixUrl: env.VITE_API_URL,
          })
          .json<CheckoutPortalV1Response>();
      },
    });

    context.queryClient.prefetchQuery(opts);
  },
});

function CheckoutPage() {
  const { checkoutId } = Route.useParams();

  const [isProcessing, setIsProcessing] = useState(false);

  const firstDataLoad = useRef({ loaded: false, isProcessing: false });
  const toastIdRef = useRef<string | number>("");

  const { data, isPending, error } = useQuery({
    queryKey: ["checkout", checkoutId],
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
      !firstDataLoad.current.isProcessing &&
      data.hasSuccessfulTransaction &&
      !toastIdRef.current
    ) {
      toastIdRef.current = toast.loading("Hold on tight! We're processing your payment.");

      setTimeout(() => {
        toast.info("Unable to process your payment.", {
          id: toastIdRef.current,
          richColors: true,
          duration: 10_000, // 10s
        });
        setIsProcessing(true);
      }, 5000);
    }

    if (data.hasSuccessfulWebhook && data.hasSuccessfulTransaction) {
      const redirectUrl = data.checkout.redirectUrl;
      const validURL = URL.canParse(redirectUrl);

      if (validURL) {
        return window.location.assign(redirectUrl);
      }

      if (window.history.length > 1) {
        return window.history.back();
      }

      toast.success("Payment successful!", {
        id: toastIdRef.current,
        description: "Your payment has been successfully processed.",
      });
    }
  }, [data]);

  if (isPending) {
    return <div className="h-dvh w-full bg-gray-2" />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
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
  );
}
