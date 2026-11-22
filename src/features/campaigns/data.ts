export type Channel = "push" | "sms" | "email";
export type CampaignStatus = "draft" | "scheduled" | "sent";
export type Campaign = {
  id: string;
  name: string;
  channel: Channel;
  audience: string;
  status: CampaignStatus;
  when: string;
  sent: number;
  opened: number;
};

export const audiences = [
  { id: "all", label: "All customers", count: 1248 },
  { id: "activated", label: "Activated app users", count: 974 },
  { id: "pending", label: "Pending activation", count: 186 },
  { id: "expiring", label: "Protection expiring in 90 days", count: 64 },
];

export const campaigns: Campaign[] = [
  {
    id: "c1",
    name: "Winter tire swap reminder",
    channel: "push",
    audience: "Activated app users",
    status: "scheduled",
    when: "Nov 28, 9:00 AM",
    sent: 0,
    opened: 0,
  },
  {
    id: "c2",
    name: "Holiday service credit bonus",
    channel: "email",
    audience: "All customers",
    status: "sent",
    when: "Nov 15",
    sent: 1248,
    opened: 612,
  },
  {
    id: "c3",
    name: "Finish your app setup",
    channel: "sms",
    audience: "Pending activation",
    status: "sent",
    when: "Nov 10",
    sent: 212,
    opened: 143,
  },
  {
    id: "c4",
    name: "Warranty renewal offer",
    channel: "email",
    audience: "Protection expiring in 90 days",
    status: "draft",
    when: "—",
    sent: 0,
    opened: 0,
  },
];
