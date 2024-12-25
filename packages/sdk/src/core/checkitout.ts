import { API_URL, WEB_URL } from "./constant";
import type {
  CheckoutCreateBody,
  CheckoutRequest,
  CreateCheckoutResponse,
  FindOneResponse,
} from "../type";
import { type Api, type ApiResponseError, createApiCall, roundCurrency } from "./util";

export interface CheckitoutOptions {
  token: string;

  /**
   * @default "https://api-checkitout.rinyato.com"
   */
  apiUrl?: string;

  /**
   * @default "https://checkitout.rinyato.com"
   */
  webUrl?: string;
}

export class Checkitout {
  protected api: Api;
  protected apiUrl: string;
  protected webUrl: string;
  protected token: string;

  constructor(opts: { apiUrl?: string; webUrl?: string; token: string }) {
    // if (typeof window !== "undefined") {
    //   throw new Error("Checkitout SDK should be used in server environment only");
    // }

    this.token = opts.token;
    this.apiUrl = opts.apiUrl || API_URL;
    this.webUrl = opts.webUrl || WEB_URL;

    this.api = createApiCall();
  }

  getCheckoutUrl(checkoutId: string) {
    return new URL(`/portal/${checkoutId}`, this.webUrl).toString();
  }

  async create(
    request: CheckoutRequest,
    config: { startTracking: boolean } = { startTracking: false },
  ) {
    const url = new URL("/v1/checkout", this.apiUrl);

    if (config.startTracking) {
      url.searchParams.append("startTracking", "true");
    }

    const subTotal = request.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const discount =
      request.discount?.type === "AMOUNT"
        ? request.discount.value
        : (subTotal * (request.discount?.value || 0)) / 100;

    const tax = ((subTotal - discount) * (request.tax || 0)) / 100;
    const total =
      request.currency === "USD"
        ? roundCurrency(subTotal - discount + tax)
        : subTotal - discount + tax;

    const requestTotal =
      request.currency === "USD" && request.total
        ? roundCurrency(request.total)
        : request.total;

    if (request.total && total !== requestTotal) {
      return {
        error: {
          status: 400,
          message: `Total amount does not match, assert: ${requestTotal}, calculated: ${total}`,
        },
        data: null,
      } satisfies ApiResponseError;
    }

    const body = {
      currency: request.currency,

      items: request.items,

      subTotal,

      discountType: request.discount?.type,
      discount: request.discount?.value,

      tax: request.tax,

      total,

      clientName: request.client.name,
      clientPhone: request.client.phone,
      clientAddress: request.client.address,

      redirectUrl: request.redirectUrl,

      additionalInfo: request.additionalInfo,
    } satisfies CheckoutCreateBody;

    return this.api<CreateCheckoutResponse>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(body),
    });
  }

  // async findMany() {
  //   const url = new URL("/checkout", this.apiUrl);
  //   return this.api<Checkout[]>(url, {
  //     headers: {
  //       Authorization: `Bearer ${this.token}`,
  //     },
  //   });
  // }

  async findOne(checkoutId: string) {
    const url = new URL(`v1/checkout/${checkoutId}`, this.apiUrl);
    return this.api<FindOneResponse>(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  protected async _INTERNAL_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_track(
    checkoutId: string,
    onPaid: () => void,
    onWebhookCalled: () => void,
  ) {
    const url = new URL(`/checkout/${checkoutId}/track`, this.apiUrl);

    const eventSource = new EventSource(url, {
      withCredentials: true,
    });

    eventSource.onmessage = (event) => {
      const data = event.data;
      if (data === "PAID") {
        onPaid();
      } else if (data === "WEBHOOK_CALLED") {
        onWebhookCalled();
        eventSource.close();
      }
    };

    return () => eventSource.close();
  }
}
