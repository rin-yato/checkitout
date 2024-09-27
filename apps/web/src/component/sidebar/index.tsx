import { cn } from "@/lib/cn";
import { Avatar, Em, Flex, Heading, Kbd, Separator, Text } from "@radix-ui/themes";
import { FooterModules, MainModules } from "./modules";
import { SIDEBAR_WIDTH } from "@/constant/theme";
import { Button } from "../ui/button";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useAuth } from "@/provider/auth.provider";
import { getInitial } from "@/lib/utils";

export function Sidebar() {
  const user = useAuth();
  return (
    <aside
      style={{ minWidth: SIDEBAR_WIDTH }}
      className={cn("flex flex-col gap-y-5 bg-gray-2 p-5")}
    >
      <div className="flex items-center gap-x-2 px-2">
        <Avatar
          size="2"
          fallback="JM"
          src="/logo.png"
          alt="Checkitout Logo"
          className="rounded-3 shadow-lg"
        />

        <Heading size="5" weight="medium">
          <Em>Checkitout</Em>
        </Heading>
      </div>

      <Button variant="soft" color="gray" className="my-3 justify-start">
        <MagnifyingGlass size={18} />
        <span>Search...</span>
        <Kbd className="ml-auto">
          <span>⌘&nbsp;</span>
          <span className="font-mono">K</span>
        </Kbd>
      </Button>

      <Flex direction="column">
        <MainModules />
        <Separator className="!w-auto m-3 bg-gray-4" />
        <FooterModules />
      </Flex>

      <Flex direction="column" className="mt-auto">
        <button
          type="button"
          aria-label="account-profile-menu"
          className={cn(
            "flex items-center gap-x-2.5 transition",
            "cursor-[var(--cursor-button)] rounded px-2.5 py-2 hover:bg-gray active:bg-gray-hover",
          )}
        >
          <Avatar
            color="gray"
            className="border"
            src={user.profile?.url ?? ""}
            fallback={getInitial(user.displayName)}
          />
          <Flex direction="column" overflowX="hidden">
            <Text truncate className="font-medium text-foreground" align="left">
              {user.displayName}
            </Text>
            <Text size="2" truncate color="gray" align="left">
              {user.email}
            </Text>
          </Flex>
        </button>
      </Flex>
    </aside>
  );
}
