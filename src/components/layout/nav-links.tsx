"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navGroups } from "@/config/site";
import { appraisals } from "@/features/appraisals/data";
import { referrals } from "@/features/referrals/data";
import { serviceRequests } from "@/features/service/data";
import { cn } from "@/lib/utils";

// Live counts from the same data the pages use.
const badges: Record<string, number> = {
  "service-requests": serviceRequests.filter((r) => r.status === "new").length,
  "appraisal-requests": appraisals.filter((a) => a.status === "new").length,
  referrals: referrals.filter((r) => r.stage === "new").length,
  notifications: 4,
};

export function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="space-y-5">
      {navGroups.map((g) => (
        <div key={g.label}>
          <p className="text-muted/80 mb-1.5 px-3 text-[11px] font-semibold tracking-wider uppercase">
            {g.label}
          </p>
          <div className="space-y-0.5">
            {g.items.map(({ title, href, slug, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              const badge = badges[slug];
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                    active
                      ? "from-brand-100/90 to-brand-50 text-ink bg-gradient-to-r shadow-[inset_0_0_0_1px_rgb(0_175_102/0.12)]"
                      : "hover:text-foreground text-zinc-600 hover:translate-x-0.5 hover:bg-zinc-50",
                  )}
                >
                  {active && (
                    <span className="bg-brand-500 absolute top-1/2 -left-3 h-6 w-1 -translate-y-1/2 rounded-r-full" />
                  )}
                  <Icon
                    className={cn(
                      "size-[18px] transition-colors",
                      active
                        ? "text-brand-600"
                        : "text-zinc-500 group-hover:text-zinc-800",
                    )}
                    strokeWidth={1.75}
                  />
                  <span className="flex-1 truncate">{title}</span>
                  {badge ? (
                    <span
                      className={cn(
                        "min-w-5 rounded-full px-1.5 py-0.5 text-center text-[11px] leading-none font-semibold",
                        active ? "bg-brand-500 text-white" : "bg-zinc-100 text-zinc-600",
                      )}
                    >
                      {badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
