import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { RewardsView } from "@/features/rewards/rewards-view";
import { listCustomers } from "@/services/customers";

export const metadata: Metadata = { title: "Rewards & Wallet" };

export default async function Page() {
  const customers = await listCustomers();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Rewards & Wallet"
        description="Points, service credit and the rules that drive them."
      />
      <RewardsView customers={customers} />
    </div>
  );
}
