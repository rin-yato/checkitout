import { Button as BaseButton, type ButtonProps } from "@radix-ui/themes";

export function Button({ type = "button", size = "3", ...props }: ButtonProps) {
  return <BaseButton type={type} size={size} {...props} />;
}
