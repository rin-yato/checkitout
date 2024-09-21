import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/checkouts")({
  component: CheckoutPage,
});

function CheckoutPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-5">
      <section className="flex flex-col gap-5">coming soon...</section>
    </main>
  );
}
