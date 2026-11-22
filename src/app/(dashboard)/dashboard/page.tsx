import { Car, Coins, Gift, User } from "lucide-react";
import type { Metadata } from "next";
import { appraisals } from "@/features/appraisals/data";
import { formatMoney } from "@/features/customers/types";
import { CustomersPanel } from "@/features/customers/customers-panel";
import { Hero } from "@/features/dashboard/hero";
import { AttentionCard, type Task } from "@/features/dashboard/attention-card";
import { EngagementCard } from "@/features/dashboard/engagement-card";
import { PipelineCard } from "@/features/dashboard/pipeline-card";
import { RecentActivity } from "@/features/dashboard/recent-activity";
import { StatCard } from "@/features/dashboard/stat-card";
import { toPackageRows } from "@/features/protection/rows";
import { referrals } from "@/features/referrals/data";
import { serviceRequests } from "@/features/service/data";
import { getDashboardStats, listCustomers } from "@/services/customers";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const [stats, customers] = await Promise.all([getDashboardStats(), listCustomers()]);
  const n = new Intl.NumberFormat("en-CA");

  const tasks: Task[] = [
    {
      label: "Profiles incomplete",
      count: customers.filter((c) => c.status === "profile_incomplete").length,
      href: "/customers",
      tone: "red",
    },
    {
      label: "New service requests",
      count: serviceRequests.filter((r) => r.status === "new").length,
      href: "/service-requests",
      tone: "amber",
    },
    {
      label: "Appraisals awaiting an offer",
      count: appraisals.filter((a) => a.status === "new" || a.status === "in_review")
        .length,
      href: "/appraisal-requests",
      tone: "amber",
    },
    {
      label: "Protection expiring or expired",
      count: toPackageRows(customers).filter((p) => p.state !== "active").length,
      href: "/protection-packages",
      tone: "red",
    },
    {
      label: "New referral leads",
      count: referrals.filter((r) => r.stage === "new").length,
      href: "/referrals",
      tone: "green",
    },
  ];

  return (
    <div className="space-y-6">
      <Hero
        name="John"
        attention={tasks.reduce((n, t) => n + t.count, 0)}
        tiles={[
          { label: "Activated today", value: "12" },
          { label: "Invites pending", value: String(stats.pipeline[2].count) },
          {
            label: "Open requests",
            value: String(
              serviceRequests.filter((r) => r.status !== "completed").length +
                appraisals.filter((a) => a.status === "new" || a.status === "in_review")
                  .length,
            ),
          },
        ]}
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          featured
          icon={User}
          value={n.format(stats.totalCustomers)}
          label="Total customers"
          delta={stats.deltas.customers}
          trend={stats.trends.customers}
        />
        <StatCard
          icon={Car}
          value={n.format(stats.vehiclesInProgram)}
          label="Vehicles in program"
          delta={stats.deltas.vehicles}
          trend={stats.trends.vehicles}
        />
        <StatCard
          icon={Coins}
          value={formatMoney(stats.rewardsLiabilityCents)}
          label="Rewards liability"
          delta={stats.deltas.liability}
          trend={stats.trends.liability}
        />
        <StatCard
          icon={Gift}
          value={n.format(stats.referralLeads)}
          label="Referral leads"
          delta={stats.deltas.referrals}
          trend={stats.trends.referrals}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <EngagementCard data={stats.engagement} rate={stats.engagementRate} />
        </div>
        <PipelineCard stages={stats.pipeline} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AttentionCard tasks={tasks} />
        <RecentActivity items={stats.activity} />
      </div>

      <CustomersPanel customers={customers} />
    </div>
  );
}
