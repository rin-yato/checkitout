import { cn } from "@/lib/cn";
import { MODULES, type Module } from "./config";

import { Link } from "@tanstack/react-router";

export function MainModules() {
  return (
    <ul className="space-y-2">
      {MODULES.main.map((module) => (
        <ModuleItem key={module.href} module={module} />
      ))}
    </ul>
  );
}

export function FooterModules() {
  return (
    <ul className="space-y-2">
      {MODULES.footer.map((module) => (
        <ModuleItem key={module.href} module={module} />
      ))}
    </ul>
  );
}

function ModuleItem({ module }: { module: Module }) {
  return (
    <li className="group">
      <Link to={module.href}>
        {({ isActive }) => (
          <div
            className={cn(
              "flex h-10 items-center justify-start gap-x-3 rounded px-3 py-1.5 transition-all",
              "relative w-full font-medium text-gray-foreground hover:bg-gray",
              isActive && "bg-gray-3 text-foreground",
            )}
          >
            <module.icon size={22} weight={isActive ? "fill" : "duotone"} />
            <span className="text-base">{module.label}</span>
          </div>
        )}
      </Link>
    </li>
  );
}
