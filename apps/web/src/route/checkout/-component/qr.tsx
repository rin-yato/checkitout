import { formatCurrency } from "@/lib/currency";
import { Box, Flex, Text } from "@radix-ui/themes";
import { Scan } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { InvoiceSeparator } from "./invoice";

export function QRPay() {
  return (
    <Flex
      gap="3"
      direction="column"
      className="z-10 h-fit w-[410px] rounded-6 border-2 border-gray-3 bg-panel-solid p-7"
    >
      <Flex align="center" gap="4">
        <Box asChild className="h-10 bg-black">
          <img
            alt="Album cover"
            src="https://cdn.brandfetch.io/idhpFC9J1n/w/2048/h/2048/theme/light/icon.png"
            className="rounded-5 object-contain"
          />
        </Box>
        <Flex direction="column" className="gap-2">
          <Text color="gray" trim="both">
            Bakong KHQR
          </Text>
          <Text size="4" trim="both" weight="medium">
            Mi Home BKK
          </Text>
        </Flex>
      </Flex>

      <Text size="8" weight="medium" className="pt-3 pb-4">
        {formatCurrency(918.98)} USD
      </Text>

      <InvoiceSeparator color="gray-2" />

      <Flex className="relative m-2 aspect-square px-4 pt-7 pb-4">
        <Scan className="absolute inset-0 size-full scale-125 text-gray-3" strokeWidth={0.5} />

        <QRCodeSVG
          level="L"
          value="https://www.google.comfeawfeawfelkafjelajfleawjfl ewalfjewalkfjelawjflejaf"
          className="m-8 size-fit flex-1 dark:opacity-9 dark:invert"
          imageSettings={{
            src: "/riel.png",
            height: 30,
            width: 30,
            excavate: false,
          }}
        />
      </Flex>

      <Flex className="items-center justify-center gap-3">
        <Text color="gray">Powered by</Text>
        <img
          alt="powered by khqr"
          className="h-5 object-contain"
          src="/KHQR available here - logo with bg.png"
        />
      </Flex>
    </Flex>
  );
}
