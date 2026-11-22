import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { SettingsView } from "@/features/settings/settings-view";

export const metadata: Metadata = { title: "Settings" };

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Your profile, invitation templates, team and security."
      />
      <SettingsView />
    </div>
  );
}
