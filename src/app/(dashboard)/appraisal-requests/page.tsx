import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { AppraisalsView } from "@/features/appraisals/appraisals-view";

export const metadata: Metadata = { title: "Appraisal Requests" };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Appraisal Requests"
        description="Trade-in requests from customers. Review, make an offer, track the outcome."
      />
      <AppraisalsView />
    </div>
  );
}
