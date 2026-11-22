"use client";

import { CornerDownLeft, Search, User } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { navItems } from "@/config/site";
import { Portal } from "@/components/ui/portal";
import { cn } from "@/lib/utils";

export type PaletteCustomer = { id: string; name: string; detail: string };
type Result = {
  key: string;
  label: string;
  hint: string;
  href: Route;
  group: "Pages" | "Customers";
  icon: React.ElementType;
};

export function CommandPalette({ customers }: { customers: PaletteCustomer[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const s = q.trim().toLowerCase();
    const pages: Result[] = navItems.map((n) => ({
      key: n.href,
      label: n.title,
      hint: "Go to page",
      href: n.href,
      group: "Pages",
      icon: n.icon,
    }));
    const people: Result[] = customers.map((c) => ({
      key: c.id,
      label: c.name,
      hint: `${c.id} · ${c.detail}`,
      href: `/customers/${c.id}` as Route,
      group: "Customers",
      icon: User,
    }));
    const all = [...pages, ...people];
    return (
      s
        ? all.filter((r) => `${r.label} ${r.hint}`.toLowerCase().includes(s))
        : all.slice(0, 8)
    ).slice(0, 10);
  }, [q, customers]);

  const close = () => {
    setOpen(false);
    setQ("");
    setActive(0);
  };
  const go = (r: Result) => {
    close();
    router.push(r.href);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-line text-muted hover:border-brand-500/60 flex h-10 w-full max-w-md items-center gap-2 rounded-xl border bg-zinc-50 px-3 text-sm transition-colors"
      >
        <Search className="size-4" />
        <span className="flex-1 truncate text-left">
          Search customers, vehicles, pages...
        </span>
        <kbd className="bg-surface hidden rounded-md border border-zinc-200 px-1.5 py-0.5 text-[11px] font-medium sm:inline">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
            <div
              className="animate-fade-in absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={close}
              aria-hidden
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Search"
              className="animate-fade-up bg-surface relative w-full max-w-xl overflow-hidden rounded-2xl shadow-2xl"
            >
              <div className="border-line flex items-center gap-3 border-b px-4">
                <Search className="text-muted size-5" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") close();
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActive((a) => Math.min(a + 1, results.length - 1));
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActive((a) => Math.max(a - 1, 0));
                    }
                    if (e.key === "Enter" && results[active]) go(results[active]);
                  }}
                  placeholder="Search customers, vehicles, pages..."
                  aria-label="Search"
                  className="h-14 flex-1 bg-transparent text-base outline-none"
                />
                <kbd className="rounded-md border border-zinc-200 px-1.5 py-0.5 text-[11px]">
                  Esc
                </kbd>
              </div>
              <ul className="max-h-80 overflow-y-auto p-2">
                {results.map((r, i) => {
                  const Icon = r.icon;
                  const first = i === 0 || results[i - 1].group !== r.group;
                  return (
                    <li key={r.key}>
                      {first && (
                        <p className="text-muted px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wider uppercase">
                          {r.group}
                        </p>
                      )}
                      <button
                        onClick={() => go(r)}
                        onMouseEnter={() => setActive(i)}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm",
                          active === i ? "bg-brand-50" : "",
                        )}
                      >
                        <span
                          className={cn(
                            "flex size-8 items-center justify-center rounded-lg",
                            active === i
                              ? "bg-brand-500 text-white"
                              : "bg-zinc-100 text-zinc-600",
                          )}
                        >
                          <Icon className="size-4" strokeWidth={1.75} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">{r.label}</span>
                          <span className="text-muted block truncate text-xs">
                            {r.hint}
                          </span>
                        </span>
                        {active === i && (
                          <CornerDownLeft className="text-brand-600 size-4" />
                        )}
                      </button>
                    </li>
                  );
                })}
                {results.length === 0 && (
                  <li className="text-muted py-10 text-center text-sm">
                    No results for &ldquo;{q}&rdquo;
                  </li>
                )}
              </ul>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}
