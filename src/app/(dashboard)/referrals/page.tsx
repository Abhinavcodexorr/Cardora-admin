import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { ReferralsView } from "@/features/referrals/referrals-view";

export const metadata: Metadata = { title: "Referrals" };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Referrals"
        description="Move referral leads through the pipeline."
      />
      <ReferralsView />
    </div>
  );
}
