import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { NotificationsView } from "@/features/notifications/notifications-view";

export const metadata: Metadata = { title: "Notifications" };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications"
        description="Everything that needs your attention."
      />
      <NotificationsView />
    </div>
  );
}
