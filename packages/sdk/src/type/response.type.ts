import type { Checkout, CheckoutItem } from "./checkout.type";
import type { Transaction } from "./transaction.type";

export interface CreateCheckoutResponse {
  checkout: Checkout;
  items: CheckoutItem[];
  transaction: Transaction;
}

export interface FindOneResponse extends Checkout {
  items: CheckoutItem[];
  transactions: Transaction[];
}
