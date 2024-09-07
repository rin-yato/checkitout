import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Button } from "./ui/button";

export function NotFound({ children }: { children?: ReactNode }) {
  return (
    <div>
      <div className="space-y-2 p-2">
        <div>
          {children || (
            <p className="text-gray-foreground">The page you are looking for does not exist.</p>
          )}
        </div>

        <p className="flex flex-wrap items-center gap-2">
          <Button onClick={() => window.history.back()}>Go back</Button>

          <Button asChild variant="outline" color="gray">
            <Link to="/">Start Over</Link>
          </Button>
        </p>
      </div>
    </div>
  );
}
