import { formatCurrency } from "@/lib/currency";
import type { PublicUser, PublicCheckoutWithItems } from "@repo/schema";
import { Avatar, Box, DataList, Flex, Separator, Text, Theme } from "@radix-ui/themes";
import { useMemo } from "react";
import { getDiscountAmount, getInitial } from "@/lib/utils";
import { cn } from "@/lib/cn";

export function Invoice({
  user,
  checkout,
}: {
  user: PublicUser;
  checkout: PublicCheckoutWithItems;
}) {
  const discount = useMemo(() => {
    if (!checkout.discountType || !checkout.discount) return null;

    if (checkout.discountType === "PERCENTAGE") {
      return {
        percentage: checkout.discount,
        amount: getDiscountAmount(checkout.subTotal, checkout.discount),
      };
    }

    return { percentage: null, amount: checkout.discount };
  }, [checkout]);

  const tax = useMemo(() => {
    if (!checkout.tax) return null;
    const amountAfterDiscount = checkout.subTotal - (discount?.amount ?? 0);
    return getDiscountAmount(amountAfterDiscount, checkout.tax);
  }, [checkout, discount]);

  return (
    <Theme hasBackground={false}>
      <Flex
        gap="3"
        direction="column"
        className="z-10 rounded-6 border-2 border-gray-3 bg-background p-7 sm:w-[410px]"
      >
        <Flex direction="column" gapY="4" pb="5">
          <Flex align="center" justify="between">
            <Avatar
              size="4"
              color="gray"
              src={user.profile ?? ""}
              className="ring-1 ring-gray"
              fallback={getInitial(user.displayName)}
            />
            <Text trim="both" color="gray" className="text-right">
              <span className="select-none text-gray-6">#</span>
              <span className="font-mono">{checkout.refId}</span>
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
            size="3"
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
              <DataList.Value>{checkout.clientPhone ?? "-"}</DataList.Value>
            </DataList.Item>

            <Separator orientation="vertical" size="2" />

            <DataList.Item className="pr-2">
              <DataList.Label>Location</DataList.Label>
              <DataList.Value>{checkout.clientAddress ?? "--"}</DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Flex>

        {/* <InvoiceSeparator /> */}

        <Flex direction="column" gap="5" pt="1" pb="4">
          <Text color="gray">Items</Text>

          {/* For future implementation */}
          {/* <div className="-mx-2.5 flex justify-between rounded bg-gray-a3 px-2.5 py-1"> */}
          {/*   <Text color="gray">Items</Text> */}
          {/*   <Text color="gray">Amount</Text> */}
          {/* </div> */}

          {checkout.items.map((product) => (
            <Flex gap="3" align="start" key={product.name}>
              <Avatar
                size="4"
                color="gray"
                src={product.img}
                className="ring-1 ring-gray"
                fallback={getInitial(product.name)}
              />

              <Box flexGrow="1" width="0">
                <Text className="line-clamp-1 break-all">{product.name}</Text>
                <Text color="gray" size="2">
                  Qty: x{product.quantity}
                </Text>
              </Box>

              <Text weight="medium" className="mb-auto ml-5 text-right">
                {formatCurrency(product.price * product.quantity, checkout.currency)}
              </Text>
            </Flex>
          ))}
        </Flex>

        <InvoiceSeparator className="mt-4 mb-7" />

        <Flex direction="column" gapY="3">
          <DataList.Root orientation="horizontal" className="flex-1" size="3">
            <DataList.Item>
              <DataList.Label>Subtotal</DataList.Label>
              <DataList.Value className="justify-end">
                {formatCurrency(checkout.subTotal, checkout.currency)}
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>
                Discount&nbsp;
                {discount?.percentage && <span>({discount.percentage}%)</span>}
              </DataList.Label>
              <DataList.Value className="justify-end">
                {formatCurrency(discount?.amount ?? 0, checkout.currency)}
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>
                VAT&nbsp;
                {checkout.tax && <span>({checkout.tax}%)</span>}
              </DataList.Label>
              <DataList.Value className="justify-end">
                {formatCurrency(tax ?? 0, checkout.currency)}
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
  className,
}: { color?: "gray-2" | "gray-3" | "background" | "primary"; className?: string }) {
  return (
    <div className={cn("-mx-7 relative flex items-center justify-between", className)}>
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
