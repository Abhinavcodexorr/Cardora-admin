import Link from "next/link";
import {
  ChevronRight,
  Gift,
  Tag,
  UserCheck,
  Wallet,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";

type Item = {
  id: number;
  kind: "activated" | "credit" | "appraisal" | "service" | "referral";
  title: string;
  detail: string;
  when: string;
};

const icons: Record<Item["kind"], LucideIcon> = {
  activated: UserCheck,
  credit: Wallet,
  appraisal: Tag,
  service: Wrench,
  referral: Gift,
};

export function RecentActivity({ items }: { items: readonly Item[] }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <Link
          href="/notifications"
          className="text-brand-600 inline-flex items-center text-sm font-medium hover:underline"
        >
          View All <ChevronRight className="size-4" />
        </Link>
      </div>
      <ul className="divide-line mt-3 divide-y">
        {items.map((it) => {
          const Icon = icons[it.kind];
          return (
            <li key={it.id} className="flex items-center gap-3 py-3">
              <span className="bg-brand-50 text-brand-600 flex size-10 shrink-0 items-center justify-center rounded-full">
                <Icon className="size-5" strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{it.title}</p>
                <p className="text-muted truncate text-xs">{it.detail}</p>
              </div>
              <span className="text-muted text-xs whitespace-nowrap">{it.when}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
