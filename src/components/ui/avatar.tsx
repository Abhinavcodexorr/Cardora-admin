import { cn } from "@/lib/utils";

export function Avatar({ name, className }: { name: string; className?: string }) {
  const text = name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden
      className={cn(
        "from-brand-100 to-brand-200 text-brand-700 ring-surface inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold ring-1",
        className,
      )}
    >
      {text}
    </span>
  );
}
