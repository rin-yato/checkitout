import { Button } from "@/component/ui/button";
import { CopyButton } from "@/component/ui/copy-button";
import { Label } from "@/component/ui/label";
import { COLOR } from "@/constant/theme";
import { FolderDashed, Plus, Trash } from "@phosphor-icons/react";
import {
  Code,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Separator,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { useState, type PropsWithChildren } from "react";

export const Route = createFileRoute("/_app/settings/api")({
  component: ApiTokenPage,
});

function ApiTokenPage() {
  return (
    <div className="flex flex-1 flex-col gap-y-5 pb-3">
      <div className="flex max-w-md flex-col gap-2 pt-1">
        <Heading size="4">API Token</Heading>
        <Text wrap="pretty" color="gray">
          This token will be used to authenticate your requests to our API. Make sure to keep it
          a secret!
        </Text>
      </div>

      <div className="w-full max-w-md rounded-4 bg-gray-2 p-5">
        <div className="hidden flex-col items-center gap-y-3 py-2">
          <FolderDashed size={48} className="text-gray-8" />

          <Text color="gray" align="center" wrap="balance" className="pb-1">
            Opps, looks like you don't have any token yet. To create a token, click the button
            below.
          </Text>

          <Button>
            Create Token <Plus weight="bold" />
          </Button>
        </div>

        <div className="flex items-center gap-x-3 rounded pr-1">
          <Text>Production</Text>

          <Code color="gray" size="3" className="ml-auto px-2">
            token_ey*********9n
          </Code>
          <IconButton color={COLOR.DANGER} variant="ghost">
            <Trash />
          </IconButton>
        </div>

        <Separator size="4" className="my-5" />

        <div className="flex items-center gap-x-3 rounded pr-1">
          <Text className="">Staging</Text>

          <Code color="gray" size="3" className="ml-auto px-2">
            token_ey*********9n
          </Code>
          <IconButton color={COLOR.DANGER} variant="ghost">
            <Trash />
          </IconButton>
        </div>

        <CreateTokenDialog>
          <Button variant="solid" className="mt-10">
            Create Token <Plus weight="bold" />
          </Button>
        </CreateTokenDialog>
      </div>
    </div>
  );
}

const WORDING = {
  CREATE_TOKEN: {
    title: "Create Token",
    description:
      "Token name can be used to identify between different environments of your application.",
    close: "Cancel",
  },
  TOKEN_CREATED: {
    title: "Token Created!",
    description: "This token will only be shown once, make sure to copy and keep it a secret!",
    close: "Close",
  },
};

function CreateTokenDialog(props: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [token, setToken] = useState<{ value: string; name: string } | undefined>();

  const handleCreateToken = () => {
    setPending(true);
    setTimeout(() => {
      setToken({ value: "token_eyfea8f3waj3329n", name: "Production" });
      setPending(false);
    }, 2000);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setTimeout(() => setToken(undefined), 500);
    setOpen(open);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key.toLowerCase() === "enter") handleCreateToken();
  };

  const wording = token ? WORDING.TOKEN_CREATED : WORDING.CREATE_TOKEN;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>{props.children}</Dialog.Trigger>

      <Dialog.Content maxWidth="450px" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title trim="end">{wording.title}</Dialog.Title>
        <Dialog.Description my="3" wrap="pretty" color="gray">
          {wording.description}
        </Dialog.Description>

        {token ? (
          // Token Created
          <Flex direction="column" gap="2" py="3">
            <Code size="4" color="gray" className="flex items-center px-2.5 py-1.5">
              {token.value}
              <CopyButton content={token.value} className="ml-auto" />
            </Code>
          </Flex>
        ) : (
          // Create Token
          <Flex direction="column" gap="2" py="3">
            <Label>Token Name</Label>
            <TextField.Root
              size="3"
              color="gray"
              variant="soft"
              onKeyDown={handleEnter}
              placeholder="e.g. Production"
            />
          </Flex>
        )}

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" disabled={pending}>
              {wording.close}
            </Button>
          </Dialog.Close>
          {!token && (
            <Button onClick={handleCreateToken} disabled={pending}>
              Create Token
              <Spinner loading={pending} size="2" />
            </Button>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
