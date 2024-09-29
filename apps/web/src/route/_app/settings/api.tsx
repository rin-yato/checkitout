import { Button } from "@/component/ui/button";
import { CopyButton } from "@/component/ui/copy-button";
import { Label } from "@/component/ui/label";
import { COLOR } from "@/constant/theme";
import { cn } from "@/lib/cn";
import { confirmation } from "@/lib/confirmation";
import { useCreateTokenMutation, useDeleteTokenMutation } from "@/query/token/token.mutation";
import { tokenListQuery } from "@/query/token/token.query";
import { FolderDashed, Plus, Trash } from "@phosphor-icons/react";
import {
  Code,
  Dialog,
  Flex,
  Heading,
  IconButton,
  Spinner,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type PropsWithChildren } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings/api")({
  component: ApiTokenPage,
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(tokenListQuery());
  },
});

function ApiTokenPage() {
  const { data } = useSuspenseQuery(tokenListQuery());
  const { mutate } = useDeleteTokenMutation();

  const isEmpty = data.length === 0;

  const createDeleteTokenHandler = (name: string) => () => {
    confirmation.create({
      type: "danger",
      title: (
        <div className="flex items-center">
          Delete Token&nbsp;
          <Code size="5" color={COLOR.DANGER} className="ml-1 px-2">
            {name}
          </Code>
        </div>
      ),
      description:
        "This action is not reversible. You will need to update your application with a new token.",
      confirmText: "Delete Token",
      onConfirm: () => {
        mutate(name, {
          onError: (error) => toast.error(error.message),
          onSuccess: () => toast.success("Token deleted successfully!"),
        });
      },
    });
  };

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
        <div className={cn("hidden flex-col items-center gap-y-3 py-3", isEmpty && "flex")}>
          <FolderDashed size={48} className="text-gray-8" />

          <Text color="gray" align="center" wrap="balance" className="pb-1">
            Opps, looks like you don't have any token yet. To create a token, click the button
            below.
          </Text>

          <CreateTokenDialog>
            <Button>
              Create Token <Plus weight="bold" />
            </Button>
          </CreateTokenDialog>
        </div>

        {data.map((token) => (
          <div
            key={`api-token-${token.name}`}
            className="mb-5 flex items-center gap-x-3 border-b pr-1 pb-5 last-of-type:border-0"
          >
            <Text>{token.name}</Text>

            <Code color="gray" size="3" className="ml-auto px-2">
              {token.token}
            </Code>

            <IconButton
              color={COLOR.DANGER}
              variant="ghost"
              onClick={createDeleteTokenHandler(token.name)}
            >
              <Trash />
            </IconButton>
          </div>
        ))}

        {!isEmpty && (
          <CreateTokenDialog>
            <Button variant="solid">
              Create Token <Plus weight="bold" />
            </Button>
          </CreateTokenDialog>
        )}
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
  const { mutate, isPending } = useCreateTokenMutation();

  const [open, setOpen] = useState(false);

  const [token, setToken] = useState<string>("");
  const tokenName = useRef("");

  const handleCreateToken = () => {
    mutate(tokenName.current.trim(), {
      onSuccess: ({ token }) => {
        toast.success("Token created successfully!");
        setToken(token);
      },
      onError: (error) => toast.error(error.message),
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // reset form state
      setTimeout(() => {
        setToken("");
        tokenName.current = "";
      }, 300);
    }
    setOpen(open);
  };

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key.toLowerCase() === "enter") handleCreateToken();
  };

  const wording = token ? WORDING.TOKEN_CREATED : WORDING.CREATE_TOKEN;

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger>{props.children}</Dialog.Trigger>

      <Dialog.Content maxWidth="500px" onInteractOutside={(e) => e.preventDefault()}>
        <Dialog.Title trim="end">{wording.title}</Dialog.Title>
        <Dialog.Description my="3" wrap="pretty" color="gray">
          {wording.description}
        </Dialog.Description>

        {token ? (
          // Token Created
          <Flex direction="column" gap="2" py="3">
            <Code size="4" color="gray" className="flex items-center px-2.5 py-1.5">
              {token}
              <CopyButton content={token} className="ml-auto" autoFocus />
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
              onChange={(e) => {
                tokenName.current = e.target.value.trim();
              }}
              placeholder="e.g. Production"
            />
          </Flex>
        )}

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" disabled={isPending}>
              {wording.close}
            </Button>
          </Dialog.Close>
          {!token && (
            <Button onClick={handleCreateToken} disabled={isPending}>
              Create Token
              <Spinner loading={isPending} size="2" />
            </Button>
          )}
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
