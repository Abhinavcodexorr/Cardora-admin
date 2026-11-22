import { cn } from "@/lib/utils";

const tones = {
  green: "bg-brand-50 text-brand-700 ring-brand-200",
  amber: "bg-amber-50 text-amber-800 ring-amber-200",
  blue: "bg-sky-50 text-sky-800 ring-sky-200",
  gray: "bg-zinc-100 text-zinc-700 ring-zinc-200",
} as const;

export function Badge({
  tone = "green",
  className,
  ...props
}: React.ComponentProps<"span"> & { tone?: keyof typeof tones }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset before:size-1.5 before:rounded-full before:bg-current",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
