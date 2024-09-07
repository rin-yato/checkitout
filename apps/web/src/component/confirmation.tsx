import { $confirmationAtom } from "@/lib/confirmation";
import { useStore } from "@nanostores/react";
import { Button, Dialog, Flex, Spinner } from "@radix-ui/themes";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";

export function Confirmation() {
  const confirmation = useStore($confirmationAtom);
  const [isPending, setIsPending] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!confirmation) return;
    $confirmationAtom.set({ ...confirmation, open });
  };

  const handleCancel = () => {
    if (!confirmation) return;
    confirmation.onCancel?.();
    $confirmationAtom.set({ ...confirmation, open: false });
  };

  const handleConfirm = async () => {
    if (!confirmation) return;

    // check if the confirmation function returns a promise
    const result = confirmation.onConfirm?.();

    // if it's a promise, set the pending state
    // and wait for the promise to resolve
    if (result instanceof Promise) {
      setIsPending(true);
      return await result.catch(console.error).finally(() => setIsPending(false));
    }

    // if it's not a promise, just close the dialog
    $confirmationAtom.set({ ...confirmation, open: false });
  };

  const color = confirmation?.type === "destructive" ? "red" : undefined;

  return (
    <Dialog.Root open={confirmation?.open} onOpenChange={handleOpenChange}>
      <Dialog.Content
        maxWidth="450px"
        onInteractOutside={(event) => {
          if (confirmation?.important) {
            event.preventDefault();
          }
        }}
      >
        {confirmation?.customContent && <confirmation.customContent />}

        {confirmation && !confirmation.customContent && (
          <Fragment>
            <Dialog.Title>{confirmation.title}</Dialog.Title>
            <Dialog.Description size="2" wrap="pretty">
              {confirmation.description}
            </Dialog.Description>

            <Flex gap="3" mt="4" justify="end">
              <Button variant="soft" color="gray" onClick={handleCancel} disabled={isPending}>
                {confirmation.cancelText}
              </Button>
              <Button
                variant="solid"
                color={color}
                onClick={handleConfirm}
                disabled={isPending}
              >
                <Spinner loading={isPending} />
                {confirmation.confirmText}
              </Button>
            </Flex>
          </Fragment>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}
