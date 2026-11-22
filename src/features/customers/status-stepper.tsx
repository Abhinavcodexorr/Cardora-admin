import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { customerStatuses, statusLabels, type CustomerStatus } from "./types";

export function StatusStepper({ status }: { status: CustomerStatus }) {
  const current = customerStatuses.indexOf(status);
  return (
    <ol className="flex items-start" aria-label="Onboarding progress">
      {customerStatuses.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={s}
            className="flex flex-1 flex-col items-center text-center"
            aria-current={active ? "step" : undefined}
          >
            <div className="flex w-full items-center">
              <span
                className={cn(
                  "h-0.5 flex-1",
                  i === 0 ? "opacity-0" : done || active ? "bg-brand-500" : "bg-line",
                )}
              />
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
                  done && "border-brand-500 bg-brand-500 text-white",
                  active &&
                    "border-brand-500 text-brand-600 ring-brand-100 bg-surface ring-4",
                  !done && !active && "border-line text-muted bg-surface",
                )}
              >
                {done ? <Check className="size-4" /> : i + 1}
              </span>
              <span
                className={cn(
                  "h-0.5 flex-1",
                  i === customerStatuses.length - 1
                    ? "opacity-0"
                    : done
                      ? "bg-brand-500"
                      : "bg-line",
                )}
              />
            </div>
            <span
              className={cn(
                "mt-2 px-1 text-xs",
                active ? "text-ink font-semibold" : "text-muted",
              )}
            >
              {statusLabels[s]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
