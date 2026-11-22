import Link from "next/link";
import { Card } from "@/components/ui/card";
import { statusLabels, type CustomerStatus } from "@/features/customers/types";

export function PipelineCard({
  stages,
}: {
  stages: readonly { status: CustomerStatus; count: number }[];
}) {
  const total = stages.reduce((n, s) => n + s.count, 0);
  const shades = ["bg-zinc-300", "bg-amber-400", "bg-sky-400", "bg-brand-500"];
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">Onboarding pipeline</h2>
      <p className="text-muted text-sm">Where customers are in the invite flow</p>
      <div
        className="mt-5 flex h-3 overflow-hidden rounded-full"
        role="img"
        aria-label="Pipeline distribution"
      >
        {stages.map((s, i) => (
          <span
            key={s.status}
            className={shades[i]}
            style={{ width: `${(s.count / total) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-5 space-y-3">
        {stages.map((s, i) => (
          <li key={s.status}>
            <Link
              href="/customers"
              className="flex items-center gap-3 text-sm hover:underline"
            >
              <span className={`size-2.5 rounded-full ${shades[i]}`} />
              <span className="flex-1">{statusLabels[s.status]}</span>
              <b>{s.count}</b>
              <span className="text-muted w-10 text-right text-xs">
                {Math.round((s.count / total) * 100)}%
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
