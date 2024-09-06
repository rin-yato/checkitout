import { Container, Grid } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { Invoice } from "./-component/invoice";

export const Route = createFileRoute("/checkout/")({
  component: CheckoutPage,
});

function CheckoutPage() {
  return (
    <main className="h-dvh bg-gray">
      <Container className="p-5">
        <Grid columns="2" className="f">
          <Invoice />
          <div>d</div>
        </Grid>
      </Container>
    </main>
  );
}
