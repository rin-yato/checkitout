import { ScribbleLoop } from "@phosphor-icons/react";

export function Logo() {
  return (
    <div className="flex size-8 items-center justify-center rounded-4 bg-gradient-to-br from-primary-9 via-primary-10 to-primary-8">
      <ScribbleLoop size={22} className="text-primary-foreground" weight="bold" />
    </div>
  );
}
