import { formatCurrency } from "@/lib/currency";
import { Avatar, Flex, Text } from "@radix-ui/themes";
import { QRCodeSVG } from "qrcode.react";
import { InvoiceSeparator } from "./invoice";
import { Check, Receipt } from "@phosphor-icons/react";
import { IconBorderCorners } from "@tabler/icons-react";
import { match } from "ts-pattern";

interface QRPayProps {
  qrCode: string;
  currency: "USD" | "KHR";
  amount: number;
  merchantName: string;
  paid: boolean;
  processing: boolean;
}

export function QRPay(props: QRPayProps) {
  const currencyImage = props.currency === "USD" ? "/usd.png" : "/riel.png";

  return (
    <Flex
      gap="3"
      direction="column"
      className="z-10 w-full rounded-6 border-2 border-gray-3 bg-surface p-7 sm:w-[410px]"
    >
      <Flex align="center" gap="4">
        <Avatar size="3" color="gray" src="/bakong-logo.png" fallback="B" />
        <Flex direction="column" className="gap-2">
          <Text color="gray" trim="both" size="2">
            Paying to
          </Text>
          <Text size="4" trim="both" weight="medium">
            {props.merchantName}
          </Text>
        </Flex>
      </Flex>

      <Text size="8" weight="medium" className="pt-3 pb-4">
        {formatCurrency(props.amount, props.currency)}{" "}
        <Text color="gray" size="4" className="mb-1">
          {props.currency}
        </Text>
      </Text>

      <InvoiceSeparator color="gray-2" />

      {match({ paid: props.paid, processing: props.processing })
        .with({ paid: true, processing: true }, () => <ProcessingState />)
        .with({ paid: true, processing: false }, () => <PaidState />)
        .with({ paid: false }, () => (
          <QRState currencyImage={currencyImage} qrCode={props.qrCode} />
        ))
        .exhaustive()}

      <Flex className="items-center justify-center gap-2">
        <Text color="gray">Payment via</Text>
        <Avatar
          size="4"
          color="red"
          src="/khqr.png"
          className="h-5 w-fit rounded-1"
          fallback={<span className="px-1.5">KHQR</span>}
        />
      </Flex>
    </Flex>
  );
}

function QRState(props: {
  currencyImage: string;
  qrCode: string;
}) {
  return (
    <Flex className="relative m-2 aspect-square px-4 pt-7 pb-4">
      <IconBorderCorners
        className="absolute inset-0 size-full scale-[1.4] text-gray-3"
        strokeWidth={0.5}
      />

      <QRCodeSVG
        level="L"
        value={props.qrCode}
        className="m-8 size-fit flex-1 dark:opacity-9 dark:invert"
        imageSettings={{
          src: props.currencyImage,
          height: 30,
          width: 30,
          excavate: false,
        }}
      />
    </Flex>
  );
}

function PaidState() {
  return (
    <Flex className="relative m-2 aspect-square flex-col px-4 pt-7 pb-4">
      <Text size="5" className="text-center font-semibold text-success">
        Paid
      </Text>
      <div className="zoom-in-50 m-14 flex aspect-square flex-1 animate-in items-center justify-center rounded-full bg-success">
        <Check className="text-success-foreground" size={86} />
      </div>
    </Flex>
  );
}

function ProcessingState() {
  return (
    <Flex className="relative m-2 aspect-square flex-col px-4 pt-7 pb-4">
      <Text size="5" className="text-center font-semibold">
        Checkout Pending
      </Text>
      <Text color="gray" className="text-center" mt="2" wrap="balance">
        Please re-check again in a few moment or contact the merchant for support
      </Text>
      <div className="zoom-in-50 m-14 flex aspect-square flex-1 animate-in items-center justify-center rounded-full bg-warning-3">
        <Receipt className="text-warning-9" size={96} weight="duotone" />
      </div>
    </Flex>
  );
}
