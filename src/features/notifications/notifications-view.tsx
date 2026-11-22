"use client";

import {
  Bell,
  CheckCheck,
  Gift,
  Tag,
  UserCheck,
  Wrench,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabBar } from "@/components/ui/tab-bar";
import { cn } from "@/lib/utils";

type Kind = "activation" | "service" | "appraisal" | "referral" | "protection";
type Item = {
  id: number;
  kind: Kind;
  title: string;
  detail: string;
  when: string;
  href: Route;
  read: boolean;
};

const icons: Record<Kind, LucideIcon> = {
  activation: UserCheck,
  service: Wrench,
  appraisal: Tag,
  referral: Gift,
  protection: ShieldAlert,
};

const seed: Item[] = [
  {
    id: 1,
    kind: "service",
    title: "New service request",
    detail: "Alex Morgan · Oil change · 2024 BMW X5",
    when: "5 min ago",
    href: "/service-requests" as Route,
    read: false,
  },
  {
    id: 2,
    kind: "activation",
    title: "Customer activated the app",
    detail: "Alex Morgan verified their phone number",
    when: "12 min ago",
    href: "/customers/CDR-10482" as Route,
    read: false,
  },
  {
    id: 3,
    kind: "appraisal",
    title: "Appraisal request received",
    detail: "Mike Turner · 2022 Audi Q5",
    when: "32 min ago",
    href: "/appraisal-requests" as Route,
    read: false,
  },
  {
    id: 4,
    kind: "referral",
    title: "New referral lead",
    detail: "Olivia Bennett referred by Alex Morgan",
    when: "1 hr ago",
    href: "/referrals" as Route,
    read: false,
  },
  {
    id: 5,
    kind: "protection",
    title: "Protection expiring soon",
    detail: "Sarah Chen · Paint & Fabric expired Nov 6",
    when: "Yesterday",
    href: "/protection-packages" as Route,
    read: true,
  },
  {
    id: 6,
    kind: "activation",
    title: "Invitation not opened",
    detail: "Mike Turner · sent 2 days ago. Consider resending.",
    when: "2 days ago",
    href: "/customers/CDR-10480" as Route,
    read: true,
  },
];

export function NotificationsView() {
  const [items, setItems] = useState(seed);
  const [tab, setTab] = useState("all");
  const unread = items.filter((i) => !i.read).length;
  const shown = items.filter(
    (i) =>
      tab === "all" ||
      (tab === "unread"
        ? !i.read
        : tab === "requests"
          ? ["service", "appraisal", "referral"].includes(i.kind)
          : ["activation", "protection"].includes(i.kind)),
  );

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <TabBar
          className="flex-1 border-b-0"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread", count: unread },
            { id: "requests", label: "Requests" },
            { id: "system", label: "Customers & contracts" },
          ]}
        />
        <Button
          disabled={unread === 0}
          onClick={() => setItems((l) => l.map((i) => ({ ...i, read: true })))}
        >
          <CheckCheck className="size-4" /> Mark all read
        </Button>
      </div>
      <ul className="divide-line mt-2 divide-y">
        {shown.map((i) => {
          const Icon = icons[i.kind];
          return (
            <li key={i.id}>
              <Link
                href={i.href}
                onClick={() =>
                  setItems((l) =>
                    l.map((x) => (x.id === i.id ? { ...x, read: true } : x)),
                  )
                }
                className="flex items-center gap-4 px-2 py-4 hover:bg-zinc-50"
              >
                <span className="bg-brand-50 text-brand-600 flex size-10 shrink-0 items-center justify-center rounded-full">
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-sm", i.read ? "font-medium" : "font-semibold")}>
                    {i.title}
                  </p>
                  <p className="text-muted truncate text-xs">{i.detail}</p>
                </div>
                <span className="text-muted text-xs whitespace-nowrap">{i.when}</span>
                {!i.read && (
                  <span
                    aria-label="Unread"
                    className="bg-brand-500 size-2.5 rounded-full"
                  />
                )}
              </Link>
            </li>
          );
        })}
        {shown.length === 0 && (
          <li className="text-muted flex flex-col items-center gap-2 py-12 text-sm">
            <Bell className="size-8" strokeWidth={1.25} /> You&apos;re all caught up.
          </li>
        )}
      </ul>
    </Card>
  );
}
