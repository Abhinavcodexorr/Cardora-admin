import { Badge } from "@/components/ui/badge";
import { statusLabels, type CustomerStatus } from "./types";

const tone: Record<CustomerStatus, React.ComponentProps<typeof Badge>["tone"]> = {
  profile_incomplete: "gray",
  ready_to_invite: "amber",
  invitation_sent: "blue",
  activated: "green",
  delivery_complete: "green",
};

export function StatusBadge({ status }: { status: CustomerStatus }) {
  return <Badge tone={tone[status]}>{statusLabels[status]}</Badge>;
}
