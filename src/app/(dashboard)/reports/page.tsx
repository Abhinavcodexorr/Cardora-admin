import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ReportsView } from "@/features/reports/reports-view";

export const metadata: Metadata = { title: "Reports" };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Activation, rewards and request performance."
      />
      <ReportsView />
    </div>
  );
}
