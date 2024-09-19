import { Em, Flex, Grid, Text } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { Invoice } from "./-component/invoice";
import { QRPay } from "./-component/qr";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";
import { useEffect, useState } from "react";
import { Check, PiggyBank, Scan } from "@phosphor-icons/react";

export const Route = createFileRoute("/portal/$checkoutId")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { checkoutId } = Route.useParams();
  const [success, setSuccess] = useState(false);

  const { data, isPending, error } = useQuery({
    queryKey: ["checkout", checkoutId],
    queryFn: () => {
      return ky
        .get(`http://localhost:3050/v1/checkout/portal/${checkoutId}`, { retry: 0 })
        .json<any>();
    },
    retry: false,
    refetchInterval: (query) =>
      query.state.status === "error" || query.state?.data?.checkout?.status === "SUCCESS"
        ? false
        : 3000,
  });

  useEffect(() => {
    if (!data?.activeTransaction) return;

    const event = new EventSource(
      `http://localhost:3050/v1/transaction/track/${data?.activeTransaction.md5}`,
    );

    event.onmessage = (e) => {
      const status = e.data;
      if (status === "COMPLETED") {
        setSuccess(true);
        event.close();
      }
    };
  }, [data]);

  if (isPending) {
    return <div className="h-dvh w-full bg-gray-2" />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <main className="h-dvh w-full">
      <Grid columns="2" className="size-full bg-gray-2 pt-10">
        <Flex className="fade-in-0 size-full animate-in justify-end px-12 py-10">
          <Invoice data={data.checkout} />
        </Flex>
        <Flex
          direction="column"
          className="fade-in-0 size-full animate-in justify-start px-12 py-10"
        >
          <div className="flex w-fit flex-col">
            <QRPay
              paid={success || data.checkout.status === "SUCCESS"}
              currency={data.checkout.currency}
              amount={data.checkout.total}
              merchantName={"Mi Home BKK"}
              qrCode={data?.activeTransaction?.qrCode}
            />
          </div>

          {/* Step by step guide for scanning QR code and paying with Bakong KHQR */}
          <Flex className="mt-8 flex-col gap-3 text-gray-foreground">
            <div className="flex items-center gap-3">
              <div className="w-fit rounded-4 border bg-background p-1.5">
                <PiggyBank size="20" />
              </div>
              <div>1. Open your banking app</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-fit rounded-4 border bg-background p-1.5">
                <Scan size="20" />
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
      </Grid>
    </main>
  );
}
