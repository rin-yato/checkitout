export const iife = <Fn extends () => any>(fn: Fn): ReturnType<Fn> => fn();

export function getInitial(name: string): string {
  return name.charAt(0).toUpperCase() || "@";
}

export function getDiscountAmount(price: number, discount: number) {
  if (discount < 0 || discount > 100) {
    console.error("Discount must be between 0 and 100, got: ", discount);
    return 0;
  }

  if (price < 0) {
    console.error("Price must be greater than 0, got: ", price);
    return 0;
  }

  return price * (discount / 100);
}

export function copyToClipboard(text: string) {
  try {
    navigator.clipboard.writeText(text);
  } catch (e) {
    console.error("Failed to copy to clipboard", e);
  }
}
