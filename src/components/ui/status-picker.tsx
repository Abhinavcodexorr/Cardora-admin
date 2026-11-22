"use client";

import { cn } from "@/lib/utils";

export function StatusPicker<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.id}
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm font-medium",
            value === o.id
              ? "border-brand-500 bg-brand-50 text-brand-700"
              : "border-line hover:bg-zinc-50",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
