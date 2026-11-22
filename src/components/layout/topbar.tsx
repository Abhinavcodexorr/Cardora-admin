import { Bell } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { CommandPalette, type PaletteCustomer } from "./command-palette";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";

export function Topbar({ customers }: { customers: PaletteCustomer[] }) {
  return (
    <header className="border-line bg-surface/75 sticky top-0 z-20 flex h-16 items-center gap-3 border-b px-4 backdrop-blur-md lg:px-8">
      <MobileNav />
      <CommandPalette customers={customers} />
      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <Link
          href="/notifications"
          aria-label="Notifications"
          className="relative rounded-xl p-2.5 hover:bg-zinc-100"
        >
          <Bell className="size-5" strokeWidth={1.75} />
          <span className="bg-brand-500 ring-surface absolute top-2 right-2.5 size-2 rounded-full ring-2" />
        </Link>
        <Link
          href="/settings"
          aria-label="Profile and settings"
          className="hover:ring-brand-200 rounded-full ring-2 ring-transparent transition"
        >
          <Avatar name="John Doe" className="size-9" />
        </Link>
      </div>
    </header>
  );
}
