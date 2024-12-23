import type { PublicCheckout, PublicCheckoutItem } from "@repo/schema";
import type { Currency, Expect, Equal } from "./shared.type";

export type AdditionalInfo = Record<string, any>;

// not sure how to test the type
type CheckoutTest = Expect<Equal<Checkout, PublicCheckout>>;

export interface Checkout {
  id: string;
  refId: string;

  /**
   * \@link [`Currency`](/docs/type#currency)
   */
  currency: Currency;

  /**
   * \@link [`Discount`](/docs/type#discount)
   */
  discountType: Discount["type"] | null;

  discount: number | null;

  tax: number | null;
  subTotal: number;
  total: number;
  clientName: string;
  clientPhone: string;
  clientAddress: string | null;

  /**
   * The URL where the user will be redirected after the checkout is completed
   */
  redirectUrl?: string | null;

  /**
   * Additional information that will be stored in the checkout
   * Must be a valid JSON object
   * - `Record<string, any>`
   */
  additionalInfo: AdditionalInfo | null;

  createdAt: Date;
  updatedAt: Date;
}

// not sure how to test the type
type CheckoutItemTest = Expect<Equal<CheckoutItem, PublicCheckoutItem>>;

export type CheckoutItem = {
  id: string;
  checkoutId: string;

  /**
   * Can be used to identify the product
   */
  productId: string | null;

  name: string;
  img: string;
  price: number;
  quantity: number;

  /**
   * \@link [`Discount`](/docs/type#discount)
   */
  discountType: Discount["type"] | null;
  discount: number | null;
};

export interface CheckoutItemRequest {
  /**
   * Can be used to identify the product
   * @default undefined
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

/**
 * Discount can be in percentage or amount, will be calculated before tax
 * - If the type is `AMOUNT`, the `value` must be the discount amount
 */
export interface Discount {
  type: "AMOUNT" | "PERCENTAGE";
  value: number;
}

export interface CheckoutRequest {
  /**
   * The currency of the checkout
   *
   * - `KHR` - Cambodian Riel
   * - `USD` - United States Dollar
   *
   * \@link [`Currency`](/docs/type#currency)
   */
  currency: Currency;

  /**
   * Discount can be in percentage or amount, will be calculated before tax
   *
   * - If the type is `AMOUNT`, the `value` must be the discount amount
   * - If the type is `PERCENTAGE`, the `value` must be a percentage 1 - 100
   *
   * \@link [`Discount`](/docs/type#discount`)
   *
   * @default undefined
   */
  discount?: Discount;

  /**
   * - Tax must be a number between (0 - 100)
   * - Will be calculated after discount
   * - If the value is out of range, the checkout will be rejected
   *
   * @default undefined
   */
  tax?: number;

  /**
   * The total amount to assert after calculating the checkout
   *
   * - If provided, it will be compared with the calculated total
   * - If the value is not the same, the checkout will be rejected
   *
   * @default undefined
   */
  total?: number;

  /**
   * @link [`ClientInfo`](/docs/type#clientinfo)
   */
  client: ClientInfo;

  /**
   * Additional information that will be stored in the checkout
   * Must be a valid JSON object
   *
   * - `Record<string, any>`
   *
   * @default undefined
   **/
  additionalInfo?: AdditionalInfo;

  /**
   * The URL where the user will be redirected after the checkout is completed
   */
  redirectUrl: string;

  /**
   * - Minimum of 1 item
   *
   * @link [`CheckoutItemRequest`](/docs/type#checkoutitemrequest`)
   */
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
