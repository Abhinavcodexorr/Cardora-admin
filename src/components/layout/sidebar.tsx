import { LogOut } from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Brand } from "./brand";
import { NavLinks } from "./nav-links";

export function Sidebar() {
  return (
    <aside className="border-line bg-surface sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r lg:flex">
      <div className="px-6 pt-6 pb-5">
        <Brand />
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <NavLinks />
      </div>
      <div className="border-line border-t p-3">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-zinc-50">
          <Avatar name="John Doe" className="size-9" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">John Doe</p>
            <p className="text-muted truncate text-xs">Admin · Toronto</p>
          </div>
          <Link
            href="/login"
            aria-label="Sign out"
            className="text-muted hover:text-foreground rounded-lg p-2 hover:bg-zinc-100"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
