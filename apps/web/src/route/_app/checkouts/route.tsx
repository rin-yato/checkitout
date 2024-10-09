import { AvatarGroup } from "@/component/avatar-group";
import { Pagination } from "@/component/pagination";
import { Button } from "@/component/ui/button";
import { COLOR } from "@/constant/theme";
import { formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/date";
import { getInitial } from "@/lib/utils";
import { checkoutListQuery } from "@/query/checkout/checkout.query";
import {
  Alarm,
  DotsThreeVertical,
  Faders,
  MagnifyingGlass,
  Plus,
  Receipt,
} from "@phosphor-icons/react";
import {
  Badge,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  Table,
  Text,
  TextField,
} from "@radix-ui/themes";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { z } from "zod";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { useSuspenseQuery } from "@tanstack/react-query";

const checkoutsSearchParams = z.object({
  page: z.number({ coerce: true }).int().catch(1),
  perPage: z.number({ coerce: true }).int().catch(10),
});

export const Route = createFileRoute("/_app/checkouts")({
  component: CheckoutPage,
  beforeLoad: ({ search, context }) => {
    return context.queryClient.ensureQueryData(checkoutListQuery(search));
  },
  validateSearch: zodSearchValidator(checkoutsSearchParams),
});

export const toCheckouts = () => Route.to;

function CheckoutPage() {
  const { page, perPage } = Route.useSearch();
  const navigate = Route.useNavigate();

  const {
    data: { total, checkouts },
  } = useSuspenseQuery({ ...checkoutListQuery({ page, perPage }) });

  const totalPages = Math.ceil(total / perPage);

  const handlePageChange = (page: number) => {
    navigate({ search: (prev) => ({ ...prev, page }) });
  };

  return (
    <main className="flex flex-1 flex-col px-10 py-5">
      <nav className="space-y-5">
        <Heading trim="normal">Checkouts</Heading>

        <Flex className="items-center justify-between pt-3">
          <TextField.Root placeholder="Search..." variant="soft" color="gray" size="3">
            <TextField.Slot>
              <MagnifyingGlass size={20} />
            </TextField.Slot>
          </TextField.Root>
          <Flex className="gap-x-3">
            <Button variant="outline" color="gray">
              <Faders size={20} />
              Filter
            </Button>

            <Button>
              Create Checkout <Plus weight="bold" />
            </Button>
          </Flex>
        </Flex>
      </nav>

      <Table.Root className="minimal-table mt-6 flex-1">
        <Table.Header>
          <Table.Row className="font-mono text-3 text-gray-foreground">
            <Table.ColumnHeaderCell>
              <Flex className="items-center gap-x-5">
                <Checkbox size="3" />
                <span>Ref</span>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Customer</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Items</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Currecy</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {checkouts.map((checkout) => (
            <Table.Row
              key={checkout.id}
              onClick={() => {
                navigate({ to: `/checkouts/${checkout.id}` });
              }}
            >
              <Table.RowHeaderCell className="font-mono">
                <Flex className="items-center gap-x-5">
                  <Checkbox size="3" />
                  <Text size="3">{checkout.refId}</Text>
                </Flex>
              </Table.RowHeaderCell>
              <Table.Cell>
                <Text weight="medium" size="3">
                  {checkout.clientName}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Text weight="medium" size="3">
                  {formatDate(checkout.createdAt)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <AvatarGroup
                  avatars={checkout.items.map((item) => ({
                    src: item.img,
                    alt: item.name,
                    fallback: getInitial(item.name),
                  }))}
                />
              </Table.Cell>
              <Table.Cell>
                <Badge size="3" className="font-mono font-semibold">
                  {checkout.currency}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <Text weight="medium" size="3">
                  {formatCurrency(checkout.total, checkout.currency)}
                </Text>
              </Table.Cell>
              <Table.Cell>
                <Badge
                  size="3"
                  className="font-mono"
                  color={
                    checkout.transactions.some((t) => t.status === "SUCCESS")
                      ? COLOR.SUCCESS
                      : COLOR.WARNING
                  }
                >
                  {checkout.transactions.some((t) => t.status === "SUCCESS") ? (
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
              </Table.Cell>
              <Table.Cell>
                <IconButton color="gray" variant="outline">
                  <DotsThreeVertical size={22} weight="bold" />
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Pagination totalPages={totalPages} currentPage={page} onPageChange={handlePageChange} />
      <Outlet />
    </main>
  );
}