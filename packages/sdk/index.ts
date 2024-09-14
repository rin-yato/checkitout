import { API_URL } from "./constant";
import type { Checkout, CheckoutRequest } from "./type";
import { createApiCall } from "./util";

export class MCheckout {
  protected apiUrl;
  protected api;
  protected userId;

  constructor(opts: { apiUrl?: string; userId: string }) {
    this.userId = opts.userId;
    this.apiUrl = opts.apiUrl || API_URL;
    this.api = createApiCall();
  }

  getCheckoutUrl(checkoutId: string) {
    return new URL(`/portal/${checkoutId}`, "http://localhost:3000").toString();
  }

  async create(request: CheckoutRequest) {
    const url = new URL("/v1/checkout", this.apiUrl);
    return this.api<Checkout>(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-User-Id": this.userId,
      },
      body: JSON.stringify(request),
    });
  }

  async findMany() {
    const url = new URL("/checkout", this.apiUrl);
    return this.api<Checkout[]>(url);
  }

  async findOne(checkoutId: string) {
    const url = new URL(`/checkout/${checkoutId}`, this.apiUrl);
    return this.api<Checkout>(url);
  }

  protected async track(checkoutId: string, onPaid: () => void) {
    const url = new URL(`/checkout/${checkoutId}/track`, this.apiUrl);
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const data = event.data;
      if (data === "COMPLETED") {
        onPaid();
        eventSource.close();
      }
    };

    return () => eventSource.close();
  }
}
