import { API_URL, WEB_URL } from "./constant";
import type { CheckoutRequest, CreateCheckoutResponse, FindOneResponse } from "./type";
import { createApiCall } from "./util";

export class Checkitout {
  protected api;
  protected apiUrl;
  protected webUrl;
  protected token;

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

  async create(request: CheckoutRequest) {
    const url = new URL("/v1/checkout", this.apiUrl);
    return this.api<CreateCheckoutResponse>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(request),
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

  // protected async track(checkoutId: string, onPaid: () => void) {
  //   const url = new URL(`/checkout/${checkoutId}/track`, this.apiUrl);
  //   const eventSource = new EventSource(url);

  //   eventSource.onmessage = (event) => {
  //     const data = event.data;
  //     if (data === "COMPLETED") {
  //       onPaid();
  //       eventSource.close();
  //     }
  //   };

  //   return () => eventSource.close();
  // }
}
