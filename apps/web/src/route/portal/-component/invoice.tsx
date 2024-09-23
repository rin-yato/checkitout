import { formatCurrency } from "@/lib/currency";
import { Box, DataList, Flex, Separator, Text, Theme } from "@radix-ui/themes";
import type { Checkout, CheckoutItem, User } from "@repo/db/schema";

export function Invoice({
  user,
  checkout,
}: {
  user: User;
  checkout: Checkout & { items: CheckoutItem[] };
}) {
  return (
    <Theme hasBackground={false}>
      <Flex
        gap="3"
        direction="column"
        className="z-10 w-[410px] rounded-6 border-2 border-gray-3 bg-surface p-7"
      >
        <Flex direction="column" gapY="4" pb="5">
          <Flex align="center" justify="between">
            <Box asChild className="h-10">
              <img
                alt="Merchant logo"
                src={user.profile ?? ""}
                className="rounded object-contain ring-1 ring-gray"
              />
            </Box>
            <Text trim="both" color="gray" className="text-right">
              <span className="select-none text-gray-6">#</span>
              <span>C10249</span>
            </Text>
          </Flex>

          <Flex direction="column" gap="2">
            <Text size="4" weight="medium">
              {user.displayName}
            </Text>
            <Text color="gray" wrap="balance">
              {user.address}
            </Text>
            <Text color="gray" wrap="pretty">
              Tel. {user.phone}
            </Text>
          </Flex>

          <DataList.Root
            orientation="vertical"
            className="-mx-7 flex flex-row items-center justify-between bg-gray-2 px-7 py-4"
          >
            <DataList.Item>
              <DataList.Label>For</DataList.Label>
              <DataList.Value>{checkout.clientName}</DataList.Value>
            </DataList.Item>

            <Separator orientation="vertical" size="2" />

            <DataList.Item>
              <DataList.Label>Tel.</DataList.Label>
              <DataList.Value>{checkout.clientPhone}</DataList.Value>
            </DataList.Item>

            <Separator orientation="vertical" size="2" />

            <DataList.Item className="pr-2">
              <DataList.Label>Location</DataList.Label>
              <DataList.Value>{checkout.clientAddress ?? "--"}</DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Flex>

        <InvoiceSeparator />

        <Flex direction="column" gap="5" pt="3" pb="4">
          <Text color="gray">Items</Text>

          {checkout.items.map((product: any) => (
            <Flex gap="3" align="start" key={product.name}>
              <Box asChild className="size-12 ring-2 ring-gray">
                <img
                  alt="Album cover"
                  src={product.img}
                  className="rounded border object-cover"
                />
              </Box>

              <Box flexGrow="1" width="0">
                <Text className="line-clamp-1 break-all">{product.name}</Text>
                <Text color="gray" size="2">
                  Qty: {product.quantity}
                </Text>
              </Box>

              <Text weight="medium" className="mb-auto ml-5 text-right">
                {formatCurrency(product.price * product.quantity, checkout.currency)}
              </Text>
            </Flex>
          ))}
        </Flex>

        <InvoiceSeparator />

        <Flex direction="column" gapY="3">
          <DataList.Root orientation="horizontal" className="flex-1">
            <DataList.Item>
              <DataList.Label>Subtotal</DataList.Label>
              <DataList.Value className="justify-end">
                {formatCurrency(
                  checkout.items.reduce(
                    (acc: number, product: any) => acc + product.price * product.quantity,
                    0,
                  ),
                  checkout.currency,
                )}
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>Discount</DataList.Label>
              <DataList.Value className="justify-end">
                {formatCurrency(checkout?.discount ?? 0, checkout.currency)}
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>VAT (10%)</DataList.Label>
              <DataList.Value className="justify-end">
                {formatCurrency(
                  checkout.items.reduce(
                    (acc: number, product: any) => acc + product.price * product.quantity,
                    0,
                  ) * (checkout?.tax ?? 0),
                  checkout.currency,
                )}
              </DataList.Value>
            </DataList.Item>

            <Separator size="4" className="col-span-2" />

            <DataList.Item>
              <DataList.Label className="items-center self-center align-middle">
                <Text size="5" weight="medium" className="rounded-4 text-right">
                  Total
                </Text>
              </DataList.Label>
              <DataList.Value className="justify-end">
                <Text size="5" weight="medium" className="rounded-4 text-right">
                  {formatCurrency(checkout.total, checkout.currency)}
                </Text>
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Flex>
      </Flex>
    </Theme>
  );
}

export function InvoiceSeparator({
  color = "gray-2",
}: { color?: "gray-2" | "gray-3" | "background" | "primary" }) {
  return (
    <div className="-mx-7 relative flex items-center justify-between">
      <div
        className="-translate-x-1/2 -scale-x-100 size-10 rounded-full border-2 border-gray-3 bg-gray-2"
        style={{
          backgroundColor: `var(--${color})`,
          clipPath: "polygon(0 0, 55% 0, 55% 100%, 0 100%)",
        }}
      />

      <div
        style={{
          height: "3px",
          backgroundImage:
            "repeating-linear-gradient(to right, var(--gray-4), var(--gray-4) 10px, transparent 10px, transparent 20px)",
        }}
        className="flex-1"
      />

      <div
        className="size-10 translate-x-1/2 rounded-full border-2 border-gray-3"
        style={{
          backgroundColor: `var(--${color})`,
          clipPath: "polygon(0 0, 55% 0, 55% 100%, 0 100%)",
        }}
      />
    </div>
  );
}
