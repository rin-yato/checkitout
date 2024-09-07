import { Button as BaseButton, type ButtonProps } from "@radix-ui/themes";

export function Button({ type = "button", ...props }: ButtonProps) {
  return <BaseButton type={type} {...props} />;
}
