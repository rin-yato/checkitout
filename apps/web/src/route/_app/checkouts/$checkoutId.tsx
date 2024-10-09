import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/component/ui/sheet";
import { ArrowsCounterClockwise, CaretRight, ShoppingCart, X } from "@phosphor-icons/react";
import {
  Avatar,
  Badge,
  DataList,
  Flex,
  IconButton,
  ScrollArea,
  Separator,
  Tabs,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Fragment, useMemo, useState } from "react";
import { toCheckouts } from "./route";
import { prefetchCheckoutDetail, useCheckoutDetail } from "@/query/checkout/checkout.query";
import { getDiscountAmount, getInitial } from "@/lib/utils";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { COLOR } from "@/constant/theme";
import { CopyButton } from "@/component/ui/copy-button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/component/ui/collapsible";
import { Button } from "@/component/ui/button";
import { match } from "ts-pattern";

export const Route = createFileRoute("/_app/checkouts/$checkoutId")({
  component: CheckoutDetailPage,
  beforeLoad: ({ params }) => {
    prefetchCheckoutDetail(params.checkoutId);
  },
});

function CheckoutDetailPage() {
  const params = Route.useParams();

  const { data, isPending, error } = useCheckoutDetail(params.checkoutId);

  const [open, setOpen] = useState(true);

  const navigate = useNavigate();

  const onOpenChange = (open: boolean) => {
    setOpen(open);

    if (!open) {
      setTimeout(() => {
        navigate({ to: toCheckouts() });
      }, 300);
    }
  };

  const discount = useMemo(() => {
    if (!data?.discountType || !data?.discount) return null;

    if (data.discountType === "PERCENTAGE") {
      return {
        percentage: data.discount,
        amount: getDiscountAmount(data.subTotal, data.discount),
      };
    }

    return { percentage: null, amount: data.discount };
  }, [data]);

  const tax = useMemo(() => {
    if (!data?.tax) return null;
    const amountAfterDiscount = data.subTotal - (discount?.amount ?? 0);
    return getDiscountAmount(amountAfterDiscount, data.tax);
  }, [data, discount]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0">
        <ScrollArea type="scroll" scrollbars="vertical" className="!m-0 px-5">
          <SheetHeader className="flex flex-1 items-center justify-between bg-background py-5">
            <SheetTitle className="flex gap-x-2">
              <div className="aspect-square w-fit rounded border bg-gray p-1 text-gray-foreground">
                <ShoppingCart weight="fill" />
              </div>
              <span>Checkout Details</span>
            </SheetTitle>
            <SheetClose asChild>
              <IconButton variant="soft" color="gray" size="1">
                <X weight="bold" />
              </IconButton>
            </SheetClose>
          </SheetHeader>

          {isPending && <div>Loading...</div>}

          {error && <div>Error: {error.message}</div>}

          {data && (
            <div className="flex flex-1 flex-col gap-y-10 pt-5">
              <div className="flex flex-col gap-y-5">
                <Text size="6" trim="start" weight="bold">
                  <span className="select-none text-gray-foreground">#</span>
                  {data.refId}
                </Text>

                <DataList.Root orientation="horizontal" className="flex-1 gap-y-3" size="3">
                  <DataList.Item>
                    <DataList.Label>Status</DataList.Label>
                    <DataList.Value className="justify-end">
                      <Badge color={COLOR.SUCCESS} size="3" className="items-center">
                        {data.transactions.some((t) => t.status === "SUCCESS") ? (
                          <Fragment>
                            <span className="mt-px size-2 rounded-full bg-success" />
                            <span>Paid</span>
                          </Fragment>
                        ) : (
                          <Fragment>
                            <span className="mt-px size-2 rounded-full bg-warning" />
                            <span>Pending</span>
                          </Fragment>
                        )}
                      </Badge>
                    </DataList.Value>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.Label>Date</DataList.Label>
                    <DataList.Value className="justify-end">
                      {formatDate(data.createdAt)}
                    </DataList.Value>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.Label>Customer</DataList.Label>
                    <DataList.Value className="justify-end">{data.clientName}</DataList.Value>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.Label>Phone</DataList.Label>
                    <DataList.Value className="justify-end">{data.clientPhone}</DataList.Value>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.Label>Location</DataList.Label>
                    <DataList.Value className="justify-end">
                      {data.clientAddress}
                    </DataList.Value>
                  </DataList.Item>
                </DataList.Root>
              </div>

              <Flex direction="column" gap="5" className="rounded border bg-surface p-6">
                <Text size="3" trim="start" weight="bold">
                  Items
                </Text>

                {data.items.map((product) => (
                  <Flex gap="3" align="start" key={product.name}>
                    <Avatar
                      size="4"
                      color="gray"
                      src={product.img}
                      className="ring-1 ring-gray"
                      fallback={getInitial(product.name)}
                    />

                    <div className="max-w-[20ch] flex-1">
                      <Text wrap="pretty" as="div" className="leading-tight">
                        {product.name}
                      </Text>
                      <Text color="gray" size="2" as="div">
                        Qty: x{product.quantity}
                      </Text>
                    </div>

                    <Text weight="medium" className="mb-auto ml-3 text-right leading-tight">
                      {formatCurrency(product.price * product.quantity, data.currency)}
                    </Text>
                  </Flex>
                ))}

                <Separator
                  size="4"
                  className="mt-1.5 border-t-2 border-dashed bg-transparent"
                />

                <DataList.Root orientation="horizontal" className="flex-1 gap-y-2.5" size="3">
                  <DataList.Item>
                    <DataList.Label>Subtotal</DataList.Label>
                    <DataList.Value className="justify-end">
                      {formatCurrency(data.subTotal, data.currency)}
                    </DataList.Value>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.Label>
                      Discount&nbsp;
                      {discount?.percentage && <span>({discount.percentage}%)</span>}
                    </DataList.Label>
                    <DataList.Value className="justify-end">
                      {formatCurrency(discount?.amount ?? 0, data.currency)}
                    </DataList.Value>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.Label>
                      VAT&nbsp;
                      {data.tax && <span>({data.tax}%)</span>}
                    </DataList.Label>
                    <DataList.Value className="justify-end">
                      {formatCurrency(tax ?? 0, data.currency)}
                    </DataList.Value>
                  </DataList.Item>

                  <DataList.Item>
                    <DataList.Label className="font-bold">Total</DataList.Label>
                    <DataList.Value className="justify-end font-bold">
                      {formatCurrency(data.total, data.currency)}
                    </DataList.Value>
                  </DataList.Item>
                </DataList.Root>
              </Flex>

              <div className="mb-5 flex-1 space-y-5 overflow-hidden rounded border bg-surface px-5 pt-4">
                <Tabs.Root defaultValue="data">
                  <Tabs.List className="gap-x-3">
                    <Tabs.Trigger value="data">
                      <Text size="3">Data</Text>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="transactions">
                      <Text size="3">Transactions</Text>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="webhooks">
                      <Text size="3">Webhooks</Text>
                    </Tabs.Trigger>
                  </Tabs.List>

                  <Tabs.Content value="data" className="group">
                    <ScrollArea className="mb-3 pt-5 pb-2" type="scroll">
                      <pre>
                        <CopyButton
                          className="absolute top-5 right-1.5 opacity-0 transition group-hover:opacity-100"
                          content={JSON.stringify(data.additionalInfo ?? {}, null, 2)}
                        />
                        <code>{JSON.stringify(data.additionalInfo, null, 2)}</code>
                      </pre>
                    </ScrollArea>
                  </Tabs.Content>

                  <Tabs.Content value="transactions">
                    <div className="flex flex-col gap-y-2 py-5">
                      {data.transactions.map((transaction, index) => (
                        <div
                          className="group flex cursor-default items-center gap-x-4 rounded bg-gray px-4 py-3"
                          key={transaction.id}
                        >
                          <Text className="text-gray-foreground">#{index + 1}</Text>
                          <Badge
                            color={match(transaction.status)
                              .with("SUCCESS", () => COLOR.SUCCESS)
                              .with("PENDING", () => COLOR.WARNING)
                              .with("FAILED", () => COLOR.DANGER)
                              .with("TIMEOUT", () => "gray" as const)
                              .exhaustive()}
                            size="2"
                            className="items-center text-2"
                          >
                            <span className="mt-px size-2 rounded-full bg-primary" />
                            <span>{transaction.status}</span>
                          </Badge>
                          <Text className="ml-auto text-gray-foreground">
                            {formatDate(transaction.updatedAt)}
                          </Text>
                        </div>
                      ))}
                    </div>
                  </Tabs.Content>

                  <Tabs.Content value="webhooks">
                    <div className="flex flex-col gap-y-2 py-5">
                      {data.webhooks.map((webhook, index) => (
                        <Collapsible
                          key={webhook.id}
                          className="flex flex-col gap-y-3 rounded bg-gray px-4 py-3"
                        >
                          <CollapsibleTrigger className="group flex cursor-default items-center gap-x-4">
                            <Text className="text-gray-foreground">#{index + 1}</Text>
                            <Badge
                              color={webhook.status >= 400 ? COLOR.DANGER : COLOR.SUCCESS}
                              data-success={webhook.status >= 200 && webhook.status < 300}
                              size="2"
                              className="group items-center text-2"
                            >
                              <span className="mt-px size-1.5 rounded-full bg-danger group-data-[success=true]:bg-success" />
                              {webhook.status}
                            </Badge>
                            <Text className="ml-auto text-gray-foreground">
                              {formatDate(webhook.createdAt)}
                            </Text>
                            <CaretRight
                              weight="bold"
                              className="text-gray-foreground transition-all group-radix-state-open:rotate-90"
                            />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="group border-t">
                            <ScrollArea className="pt-4 pb-1" type="scroll">
                              <pre>
                                <CopyButton
                                  className="absolute top-4 right-1.5 opacity-0 transition group-hover:opacity-100"
                                  content={JSON.stringify(webhook.json, null, 2)}
                                />
                                <code>{JSON.stringify(webhook.json, null, 2)}</code>
                              </pre>
                            </ScrollArea>
                          </CollapsibleContent>
                        </Collapsible>
                      ))}

                      <Tooltip content="coming soon">
                        <Button
                          variant="soft"
                          color="gray"
                          disabled
                          onClick={(e) => e.stopPropagation()}
                        >
                          Retry webhook <ArrowsCounterClockwise weight="bold" />
                        </Button>
                      </Tooltip>
                    </div>
                  </Tabs.Content>
                </Tabs.Root>
              </div>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
