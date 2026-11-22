import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { CampaignsView } from "@/features/campaigns/campaigns-view";

export const metadata: Metadata = { title: "Campaigns & Promotions" };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns & Promotions"
        description="Send push, SMS and email campaigns to customer segments."
      />
      <CampaignsView />
    </div>
  );
}
