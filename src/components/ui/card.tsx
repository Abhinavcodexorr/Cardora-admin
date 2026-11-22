import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("border-line bg-surface shadow-card rounded-2xl border", className)}
      {...props}
    />
  );
}
