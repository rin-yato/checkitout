import { Flex, Grid } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { Check, PiggyBank, Scan } from "lucide-react";
import { Invoice } from "./-component/invoice";
import { QRPay } from "./-component/qr";

export const Route = createFileRoute("/checkout/")({
  component: CheckoutPage,
});

function CheckoutPage() {
  return (
    <main className="h-dvh">
      <Grid columns="2" className="size-full bg-gray-2">
        <Flex className="size-full justify-end px-12 py-10">
          <Invoice />
        </Flex>
        <Flex direction="column" className="size-full justify-start px-12 py-10">
          <QRPay />

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
