import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ProtectionView } from "@/features/protection/protection-view";
import { listCustomers } from "@/services/customers";

export const metadata: Metadata = { title: "Protection Packages" };

export default async function Page() {
  const customers = await listCustomers();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Protection Packages"
        description="Contracts attached to customers, with expiry tracking."
      />
      <ProtectionView customers={customers} />
    </div>
  );
}
