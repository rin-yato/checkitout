import { cn } from "@/lib/cn";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = ({
  className,
  ...props
}: CollapsiblePrimitive.CollapsibleContentProps) => {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      {...props}
      className={cn("CollapsibleContent", className)}
    />
  );
};

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
