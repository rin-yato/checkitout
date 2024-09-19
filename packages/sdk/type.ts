type AdditionalInfo = Record<string, any> | unknown;

export type Currency = "USD" | "KHR";
export type CheckoutStatus = "IDLE" | "PENDING" | "PAID" | "CANCELED";
export type TransactionStatus = "TIMEOUT" | "PENDING" | "SUCCESS" | "FAILED";

export interface Checkout<TInfo extends AdditionalInfo = unknown> {
  id: string;
  refId: string;

  currency: Currency;
  subTotal: number;
  discount: number;
  tax: number;
  total: number;

  clientName: string;
  clientPhone: string;
  clientAddress?: string;

  additionalInfo: TInfo;

  status: CheckoutStatus;

  createdAt: Date;
  updatedAt: Date;
}

export type CheckoutItem = {
  id: string;
  checkoutId: string;
  productId: string;

  name: string;
  img: string;
  price: number;
  quantity: number;

  createdAt: Date;
  updatedAt: Date;
};

export type Transaction = {
  id: string;
  checkoutId: string;

  md5: string;
  qrCode: string;

  amount: number;
  currency: Currency;

  status: TransactionStatus;

  createdAt: Date;
  updatedAt: Date;
};

export interface CheckoutItemRequest {
  productId: string;
  name: string;
  img: string;
  price: number;
  quantity: number;
}

export interface CheckoutRequest {
  currency: Currency;
  subTotal: number;
  discount: number;
  tax: number;
  total: number;

  clientName: string;
  clientPhone: string;
  clientAddress?: string;

  additionalInfo?: AdditionalInfo;

  items: CheckoutItemRequest[];
}
