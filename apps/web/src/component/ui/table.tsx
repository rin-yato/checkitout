import { cn } from "@/lib/cn";
import { Flex, Grid, type FlexProps, type GridProps } from "@radix-ui/themes";

function Header({ className, ...rest }: GridProps) {
  return <Grid {...rest} className={cn("rounded bg-gray", className)} />;
}

function Row({ className, ...rest }: GridProps) {
  return <Grid {...rest} className={cn("py-1", className)} />;
}

function Cell({ className, ...rest }: FlexProps) {
  return <Flex {...rest} className={cn("px-4 py-2", className)} />;
}

export const Table = { Header, Row, Cell };
