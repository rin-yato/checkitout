import { Flex, Grid } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { Check, PiggyBank, Scan } from "lucide-react";
import { Invoice } from "./-component/invoice";
import { QRPay } from "./-component/qr";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export const Route = createFileRoute("/checkout/$checkoutId")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { checkoutId } = Route.useParams();

  const { data, isPending, error } = useQuery({
    queryKey: ["checkout", checkoutId],
    queryFn: () => {
      return ky.get(`http://localhost:3050/checkout/portal/${checkoutId}`).json<any>();
    },
    retry: 0,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <main className="h-dvh">
      <Grid columns="2" className="size-full bg-gray-2 pt-10">
        <Flex className="size-full justify-end px-12 py-10">
          <Invoice data={data.data} />
        </Flex>
        <Flex direction="column" className="size-full justify-start px-12 py-10">
          <QRPay
            paid={data.status === "SUCCESS"}
            currency={data.data.currency}
            amount={data.data.total}
            merchantName={"Mi Home BKK"}
            qrCode={data.data.activeTransaction.qrCode}
          />

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
