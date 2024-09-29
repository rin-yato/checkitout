import type { Checkout, CheckoutItem } from "./checkout.type";
import type { Equal, Expect } from "./shared.type";
import type { Transaction } from "./transaction.type";
import type { CheckoutCreateV1Response } from "@repo/schema";

type CreateCheckoutResponseTest = Expect<
  Equal<CreateCheckoutResponse, CheckoutCreateV1Response>
>;

export interface CreateCheckoutResponse {
  checkout: Checkout;
  items: CheckoutItem[];
  activeTransaction: Transaction;
}

export interface FindOneResponse extends Checkout {
  items: CheckoutItem[];
  transactions: Transaction[];
}
