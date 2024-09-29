import type { PublicCheckout, PublicCheckoutItem } from "@repo/schema";
import type { Currency, Expect, Equal } from "./shared.type";

export type AdditionalInfo = Record<string, any>;

// not sure how to test the type
type CheckoutTest = Expect<Equal<Checkout, PublicCheckout>>;

export interface Checkout {
  id: string;
  refId: string;
  currency: Currency;
  discountType: Discount["type"] | null;
  discount: number | null;
  tax: number | null;
  subTotal: number;
  total: number;
  clientName: string;
  clientPhone: string;
  clientAddress: string | null;
  redirectUrl: string;
  additionalInfo: AdditionalInfo | null;
  createdAt: Date;
  updatedAt: Date;
}

// not sure how to test the type
type CheckoutItemTest = Expect<Equal<CheckoutItem, PublicCheckoutItem>>;

export type CheckoutItem = {
  id: string;
  checkoutId: string;
  productId: string | null;

  name: string;
  img: string;
  price: number;
  quantity: number;

  discountType: Discount["type"] | null;
  discount: number | null;
};

export interface CheckoutItemRequest {
  /**
   * Can be used to identify the product
   * @optional default undefined
   */
  productId?: string;
  name: string;
  img: string;
  price: number;
  quantity: number;
}

export interface ClientInfo {
  name: string;
  phone: string;
  address?: string;
}

export interface Discount {
  type: "AMOUNT" | "PERCENTAGE";
  value: number;
}

export interface CheckoutRequest {
  currency: Currency;

  /**
   * Discount can be in percentage or amount, will be calculated before tax
   *
   * - If the type is "AMOUNT", the value must be the discount amount
   * - If the type is "PERCENTAGE", the value must be a percentage 1 - 100
   *
   * @optional default undefined
   */
  discount?: Discount;

  /**
   * Tax in percentage (0 - 100), will be calculated after discount
   * If the provided value is out of range, the checkout will be rejected
   * @optional default 0
   */
  tax?: number;

  /**
   * This will be used to assert the total amount of the checkout
   * If the total amount is not equal to the sum of all items, discount,
   * and tax, the checkout will be rejected
   *
   * If not provided, the total will be automatically calculated.
   *
   * @Optional
   */
  total?: number;

  client: ClientInfo;

  /**
   * Additional information that will be stored in the checkout
   * Must be a valid JSON object
   *
   * @optional default undefined
   **/
  additionalInfo?: AdditionalInfo;

  /**
   * The URL where the user will be redirected after the checkout is completed
   * @required
   */
  redirectUrl: string;

  items: CheckoutItemRequest[];
}

export type CheckoutCreateBody = {
  tax?: number;
  total: number;
  subTotal: number;
  discount?: number;
  discountType?: Discount["type"];
  currency: Currency;
  clientName: string;
  clientPhone: string;
  clientAddress?: string;
  redirectUrl: string;
  additionalInfo?: AdditionalInfo;

  items: CheckoutItemRequest[];
};
