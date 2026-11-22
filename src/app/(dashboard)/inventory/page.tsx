import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { InventoryView } from "@/features/inventory/inventory-view";

export const metadata: Metadata = { title: "Inventory (IMS Feed)" };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory (IMS Feed)"
        description="Available-for-sale vehicles shown in the customer app's Shop."
      />
      <InventoryView />
    </div>
  );
}
