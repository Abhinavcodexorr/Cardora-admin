import { ArrowUp, type LucideIcon } from "lucide-react";
import { Sparkline } from "@/components/charts";
import { cn } from "@/lib/utils";
import { AnimatedValue } from "./animated-value";

export function StatCard({
  icon: Icon,
  value,
  label,
  delta,
  trend,
  featured,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  delta?: number;
  trend?: number[];
  featured?: boolean;
}) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-5 transition duration-300 hover:-translate-y-1",
        featured
          ? "from-brand-500 border-transparent bg-gradient-to-br to-[#007d49] text-white shadow-[0_12px_32px_-12px_rgb(0_175_102/0.7)]"
          : "border-line bg-surface shadow-card hover:shadow-[0_14px_32px_-14px_rgb(10_10_10/0.18)]",
      )}
    >
      {featured && (
        <span
          aria-hidden
          className="absolute -top-10 -right-10 size-36 rounded-full bg-white/10"
        />
      )}
      <div className="relative flex items-start justify-between">
        <span
          className={cn(
            "flex size-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
            featured ? "bg-white/20 text-white" : "bg-brand-50 text-brand-600",
          )}
        >
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
        {trend && (
          <Sparkline
            values={trend}
            color={featured ? "#ffffff" : "#00af66"}
            className="h-8 w-20"
          />
        )}
      </div>
      <p className="relative mt-4 text-xl font-bold tracking-tight tabular-nums sm:text-2xl xl:text-3xl">
        <AnimatedValue value={value} />
      </p>
      <div className="relative mt-0.5 flex items-center justify-between">
        <p className={cn("text-sm", featured ? "text-white/80" : "text-muted")}>
          {label}
        </p>
        {delta !== undefined && (
          <p
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-semibold",
              featured ? "bg-white/20 text-white" : "bg-brand-50 text-brand-700",
            )}
          >
            <ArrowUp className="size-3" />
            {delta}%
          </p>
        )}
      </div>
    </div>
  );
}
