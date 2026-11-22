import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ServiceView } from "@/features/service/service-view";

export const metadata: Metadata = { title: "Service Requests" };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Requests"
        description="Requests submitted from the Cardora App. Assign, schedule and complete."
      />
      <ServiceView />
    </div>
  );
}
