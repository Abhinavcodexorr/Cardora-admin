"use client";

import { cn } from "@/lib/utils";

export type TabItem = { id: string; label: string; count?: number };

export function TabBar({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn("border-line flex gap-6 overflow-x-auto border-b text-sm", className)}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn(
            "-mb-px flex items-center gap-2 border-b-2 pb-3 font-medium whitespace-nowrap",
            value === t.id
              ? "border-brand-500 text-ink"
              : "text-muted hover:text-foreground border-transparent",
          )}
        >
          {t.label}
          {t.count !== undefined && (
            <span
              className={cn(
                "rounded-full px-1.5 text-xs",
                value === t.id
                  ? "bg-brand-100 text-brand-700"
                  : "bg-zinc-100 text-zinc-600",
              )}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/** Pill-style segmented control (e.g. date ranges). */
export function Segmented({
  options,
  value,
  onChange,
  label,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex rounded-xl bg-zinc-100 p-1 text-sm"
    >
      {options.map((o) => (
        <button
          key={o.id}
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-lg px-3 py-1 font-medium",
            value === o.id
              ? "text-ink bg-surface shadow-sm"
              : "text-muted hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
