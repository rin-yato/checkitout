import { formatCurrency } from "@/lib/currency";
import { Box, DataList, Flex, Separator, Text, Theme } from "@radix-ui/themes";

const products = [
  {
    name: "Xiaomi Smart Humidifier 2",
    total: 49,
    quantity: 1,
    cover:
      "https://i02.appmifile.com/mi-com-product/fly-birds/xiaomi-smart-humidifier-2/3f66820b01cabeb20da097e209695a84.png",
  },
  {
    name: "Xiaomi Smart Standing Fan 1C",
    total: 56.99,
    quantity: 1,
    cover: "https://xiaomistoreph.com/cdn/shop/products/KSP3_1024x1024.jpg?v=1715223134",
  },
  {
    name: "Xiaomi Air Purifier 4 Pro",
    cover:
      "https://i01.appmifile.com/webfile/globalimg/products/m/xiaomi-smart-air-purifier-4-pro/section11Img.png",
    total: 248,
    quantity: 1,
  },
  {
    name: "Xiaomi Mi Smart Washing Machine",
    cover:
      "https://www.priceboon.com/wp-content/uploads/2018/12/Xiaomi-Mijia-Smart-Washing-Machine.jpg",
    quantity: 1,
    total: 564.99,
  },
];

export function Invoice({ data }: any) {
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
                // src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg"
                src={data.user.profile}
                className="rounded object-contain"
              />
            </Box>
            <Text trim="both" color="gray" className="text-right">
              <span className="select-none text-gray-6">#</span>
              <span>C10249</span>
            </Text>
          </Flex>

          <Flex direction="column" gap="2">
            <Text size="4" weight="medium">
              {data.user.displayName}
            </Text>
            <Text color="gray" wrap="balance">
              217A Street 63, Preah Trasak Paem, Beong Keng Kang, Phnom Penh
            </Text>
            <Text color="gray" wrap="pretty">
              Tel. 096 229 6000
            </Text>
          </Flex>

          <DataList.Root
            orientation="vertical"
            className="-mx-7 flex flex-row items-center justify-between bg-gray-2 px-7 py-4"
          >
            <DataList.Item>
              <DataList.Label>For</DataList.Label>
              <DataList.Value>{data.clientName}</DataList.Value>
            </DataList.Item>

            <Separator orientation="vertical" size="2" />

            <DataList.Item>
              <DataList.Label>Tel.</DataList.Label>
              <DataList.Value>{data.clientPhone}</DataList.Value>
            </DataList.Item>

            <Separator orientation="vertical" size="2" />

            <DataList.Item className="pr-2">
              <DataList.Label>Location</DataList.Label>
              <DataList.Value>{data.clientAddress ?? "--"}</DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Flex>

        <InvoiceSeparator />

        <Flex direction="column" gap="5" pt="3" pb="4">
          <Text color="gray">Items</Text>

          {data.items.map((product: any) => (
            <Flex gap="3" align="start" key={product.name}>
              <Box asChild className="size-12 ring-2 ring-gray">
                <img
                  alt="Album cover"
                  src={products[0]?.cover}
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
                {formatCurrency(product.price * product.quantity)}
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
                  data.items.reduce(
                    (acc: number, product: any) => acc + product.price * product.quantity,
                    0,
                  ),
                )}
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>Discount</DataList.Label>
              <DataList.Value className="justify-end">
                {formatCurrency(data.discount)}
              </DataList.Value>
            </DataList.Item>

            <DataList.Item>
              <DataList.Label>VAT (10%)</DataList.Label>
              <DataList.Value className="justify-end">
                {formatCurrency(
                  data.items.reduce(
                    (acc: number, product: any) => acc + product.price * product.quantity,
                    0,
                  ) * data.tax,
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
                  {formatCurrency(data.total)}
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
