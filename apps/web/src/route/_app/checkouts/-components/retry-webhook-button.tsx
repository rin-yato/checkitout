import { Button } from "@/component/ui/button";
import { useRetryCheckoutWebhookMutation } from "@/query/checkout/checkout.mutation";
import { ArrowsCounterClockwise } from "@phosphor-icons/react";
import { Spinner } from "@radix-ui/themes";
import { toast } from "sonner";

export function RetryWebhookButton({
  allowRetryWebhook,
  checkoutId,
}: { allowRetryWebhook: boolean; checkoutId: string }) {
  const { mutate, isPending } = useRetryCheckoutWebhookMutation();

  const handleRetry = () => {
    if (!allowRetryWebhook) return;

    mutate(checkoutId, {
      onError: () => {
        toast.error("Webhook failed, please try again later");
      },
      onSuccess: () => {
        toast.success("Webhook processed successfully");
      },
    });
  };

  return (
    <Button
      variant="soft"
      color="gray"
      onClick={handleRetry}
      disabled={isPending || !allowRetryWebhook}
    >
      Retry webhook
      <Spinner loading={isPending}>
        <ArrowsCounterClockwise weight="bold" />
      </Spinner>
    </Button>
  );
}
