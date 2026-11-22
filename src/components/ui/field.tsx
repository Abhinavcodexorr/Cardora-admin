"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export const inputCls =
  "border-line focus:border-brand-500 focus:ring-brand-100 h-10 w-full rounded-xl border bg-surface px-3 text-sm outline-none focus:ring-4 aria-[invalid=true]:border-red-400";
export const textareaCls =
  "border-line focus:border-brand-500 focus:ring-brand-100 w-full rounded-xl border bg-surface px-3 py-2 text-sm outline-none focus:ring-4";

export function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className={cn(className)}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-muted mt-1 text-xs">{hint}</p>}
    </div>
  );
}
