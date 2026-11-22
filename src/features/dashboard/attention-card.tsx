import { ChevronRight } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export type Task = {
  label: string;
  count: number;
  href: Route;
  tone: "red" | "amber" | "green";
};

const dot = { red: "bg-red-500", amber: "bg-amber-400", green: "bg-brand-500" } as const;

export function AttentionCard({ tasks }: { tasks: Task[] }) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold">Needs attention</h2>
      <p className="text-muted text-sm">Open work across your queues</p>
      <ul className="divide-line mt-3 divide-y">
        {tasks.map((t) => (
          <li key={t.label}>
            <Link
              href={t.href}
              className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 text-sm hover:bg-zinc-50"
            >
              <span className={`size-2.5 rounded-full ${dot[t.tone]}`} />
              <span className="flex-1 font-medium">{t.label}</span>
              <span className="bg-inverse min-w-6 rounded-full px-2 py-0.5 text-center text-xs font-semibold text-white">
                {t.count}
              </span>
              <ChevronRight className="text-muted size-4" />
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
