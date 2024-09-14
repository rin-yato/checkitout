import { products } from "@/constant/product";
import { createFileRoute } from "@tanstack/react-router";
import { MCheckout } from "@justmiracle/checkout";
import type { CheckoutItemRequest } from "@justmiracle/checkout/type";
import { Button } from "@/component/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const handleCheckout = async () => {
    const selectedProducts: CheckoutItemRequest[] = products.map((product) => ({
      name: product.name,
      img: product.cover,
      price: product.total,
      quantity: product.quantity,
      productId: product.name,
    }));

    const mc = new MCheckout({ userId: "user_8S1F4b4eqb5Afw" });

    const checkout = await mc.create({
      clientName: "Kimthean",
      clientPhone: "012345678",
      clientAddress: "Sichuan",

      currency: "KHR",
      discount: 0,
      tax: 0,
      subTotal: 750,
      total: 750,

      items: selectedProducts,
    });

    if (checkout.error) {
      console.error(checkout.error);
      // toast.error(checkout.error);
      return;
    }

    const url = mc.getCheckoutUrl(checkout.data.id);
    window.open(url, "_blank");
  };

  return (
    <main className="flex h-dvh flex-col items-center pt-28">
      <section className="flex flex-col gap-5">
        {products.map((product) => (
          <div key={product.name} className="flex flex-1 items-center gap-3">
            <img
              src={product.cover}
              alt={product.name}
              className="aspect-square size-12 rounded border-2 object-cover"
            />
            <h2 className="mt-2 text-xl">{product.name}</h2>
          </div>
        ))}

        <Button onClick={handleCheckout}>Checkout</Button>
      </section>
    </main>
  );
}
