export const serviceStatuses = ["new", "scheduled", "in_progress", "completed"] as const;
export type ServiceStatus = (typeof serviceStatuses)[number];
export const serviceLabels: Record<ServiceStatus, string> = {
  new: "New",
  scheduled: "Scheduled",
  in_progress: "In progress",
  completed: "Completed",
};

export type ServiceRequest = {
  id: string;
  customer: string;
  customerId: string;
  vehicle: string;
  type: string;
  preferred: string;
  notes: string;
  status: ServiceStatus;
  advisor: string;
  created: string;
  creditApplied: boolean;
};

export const advisors = ["Unassigned", "Priya S.", "Daniel K.", "Marco R."];

export const serviceRequests: ServiceRequest[] = [
  {
    id: "SR-2041",
    customer: "Alex Morgan",
    customerId: "CDR-10482",
    vehicle: "2024 BMW X5",
    type: "Oil change",
    preferred: "Nov 25, 2026",
    notes: "Also check the tire pressure warning.",
    status: "new",
    advisor: "Unassigned",
    created: "5 min ago",
    creditApplied: false,
  },
  {
    id: "SR-2040",
    customer: "Emma Roberts",
    customerId: "CDR-10479",
    vehicle: "2024 Toyota RAV4",
    type: "Brake inspection",
    preferred: "Nov 26, 2026",
    notes: "Squeaking when braking at low speed.",
    status: "new",
    advisor: "Unassigned",
    created: "1 hr ago",
    creditApplied: false,
  },
  {
    id: "SR-2038",
    customer: "Sarah Chen",
    customerId: "CDR-10481",
    vehicle: "2023 Audi Q5",
    type: "Tire rotation",
    preferred: "Nov 24, 2026",
    notes: "",
    status: "scheduled",
    advisor: "Priya S.",
    created: "Yesterday",
    creditApplied: true,
  },
  {
    id: "SR-2035",
    customer: "Mike Turner",
    customerId: "CDR-10480",
    vehicle: "2022 Honda CR-V",
    type: "Recall service",
    preferred: "Nov 23, 2026",
    notes: "Airbag recall notice received.",
    status: "in_progress",
    advisor: "Marco R.",
    created: "2 days ago",
    creditApplied: false,
  },
  {
    id: "SR-2029",
    customer: "Alex Morgan",
    customerId: "CDR-10482",
    vehicle: "2024 BMW X5",
    type: "Diagnostic",
    preferred: "Nov 14, 2026",
    notes: "Check engine light.",
    status: "completed",
    advisor: "Daniel K.",
    created: "1 week ago",
    creditApplied: true,
  },
];
