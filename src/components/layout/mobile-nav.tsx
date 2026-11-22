"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { NavLinks } from "./nav-links";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="rounded-full p-2 hover:bg-zinc-100 lg:hidden"
      >
        <Menu className="size-5" />
      </button>
      {open && (
        <Drawer
          title="Cardora Admin"
          side="left"
          width="max-w-[300px]"
          onClose={() => setOpen(false)}
        >
          <NavLinks onNavigate={() => setOpen(false)} />
        </Drawer>
      )}
    </>
  );
}
