import { cn } from "@/lib/cn";
import { Check, Copy } from "@phosphor-icons/react";
import { IconButton, type IconButtonProps } from "@radix-ui/themes";
import { useState } from "react";

type IconButtonPickProps = Pick<IconButtonProps, "variant" | "size" | "color" | "className">;

interface CopyButtonProps extends IconButtonPickProps {
  iconSize?: number;
  content: string;
}

export function CopyButton({
  iconSize,
  variant = "ghost",
  color = "gray",
  content,
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1600);
    } catch (error) {
      console.error("[CopyButton] Failed to copy to clipboard:", error);
    }
  };

  const Icon = isCopied ? Check : Copy;

  return (
    <IconButton {...props} variant={variant} color={color} onClick={handleCopy}>
      <Icon
        size={iconSize || 18}
        className={cn("zoom-in animate-in", isCopied && "text-success")}
      />
    </IconButton>
  );
}
