export const appraisalStatuses = [
  "new",
  "in_review",
  "offer_sent",
  "accepted",
  "declined",
] as const;
export type AppraisalStatus = (typeof appraisalStatuses)[number];
export const appraisalLabels: Record<AppraisalStatus, string> = {
  new: "New",
  in_review: "In review",
  offer_sent: "Offer sent",
  accepted: "Accepted",
  declined: "Declined",
};

export type Appraisal = {
  id: string;
  customer: string;
  customerId: string;
  vehicle: string;
  odometerKm: number;
  condition: string;
  notes: string;
  status: AppraisalStatus;
  offerCents?: number;
  created: string;
};

export const appraisals: Appraisal[] = [
  {
    id: "AP-318",
    customer: "Mike Turner",
    customerId: "CDR-10480",
    vehicle: "2022 Audi Q5",
    odometerKm: 41100,
    condition: "Good",
    notes: "One owner, full service history.",
    status: "new",
    created: "32 min ago",
  },
  {
    id: "AP-317",
    customer: "Emma Roberts",
    customerId: "CDR-10479",
    vehicle: "2019 Honda Civic",
    odometerKm: 88200,
    condition: "Fair",
    notes: "Minor scratches on rear bumper.",
    status: "in_review",
    created: "Today",
  },
  {
    id: "AP-315",
    customer: "Sarah Chen",
    customerId: "CDR-10481",
    vehicle: "2020 BMW X3",
    odometerKm: 62400,
    condition: "Excellent",
    notes: "",
    status: "offer_sent",
    offerCents: 3150000,
    created: "Yesterday",
  },
  {
    id: "AP-311",
    customer: "Alex Morgan",
    customerId: "CDR-10482",
    vehicle: "2018 Lexus RX 350",
    odometerKm: 94000,
    condition: "Good",
    notes: "New tires last spring.",
    status: "accepted",
    offerCents: 2475000,
    created: "5 days ago",
  },
  {
    id: "AP-306",
    customer: "Daniel Park",
    customerId: "CDR-10478",
    vehicle: "2017 Ford Escape",
    odometerKm: 131000,
    condition: "Fair",
    notes: "",
    status: "declined",
    offerCents: 1050000,
    created: "1 week ago",
  },
];
