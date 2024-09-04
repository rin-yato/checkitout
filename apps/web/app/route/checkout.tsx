import { Grid } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  return (
    <main>
      <Grid columns="2" className="">
        <div className="bg-primary-9">a</div>
        <div>d</div>
      </Grid>
    </main>
  );
}
