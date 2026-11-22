export type TxType = "earned" | "redeemed" | "credit" | "adjustment";
export type Tx = {
  id: string;
  customer: string;
  customerId: string;
  type: TxType;
  description: string;
  points: number; // signed
  creditCents: number; // signed
  date: string;
};

export const transactions: Tx[] = [
  {
    id: "t1",
    customer: "Alex Morgan",
    customerId: "CDR-10482",
    type: "earned",
    description: "Service visit — oil change",
    points: 120,
    creditCents: 0,
    date: "Nov 21, 2026",
  },
  {
    id: "t2",
    customer: "Sarah Chen",
    customerId: "CDR-10481",
    type: "redeemed",
    description: "Service credit redeemed",
    points: 0,
    creditCents: -10000,
    date: "Nov 21, 2026",
  },
  {
    id: "t3",
    customer: "Daniel Park",
    customerId: "CDR-10478",
    type: "credit",
    description: "Initial service credit",
    points: 0,
    creditCents: 10000,
    date: "Nov 20, 2026",
  },
  {
    id: "t4",
    customer: "Emma Roberts",
    customerId: "CDR-10479",
    type: "earned",
    description: "Referral converted",
    points: 500,
    creditCents: 0,
    date: "Nov 19, 2026",
  },
  {
    id: "t5",
    customer: "Alex Morgan",
    customerId: "CDR-10482",
    type: "redeemed",
    description: "Points redeemed for accessory",
    points: -300,
    creditCents: 0,
    date: "Nov 17, 2026",
  },
  {
    id: "t6",
    customer: "Mike Turner",
    customerId: "CDR-10480",
    type: "adjustment",
    description: "Goodwill adjustment",
    points: 250,
    creditCents: 0,
    date: "Nov 15, 2026",
  },
  {
    id: "t7",
    customer: "Priya Nair",
    customerId: "CDR-10477",
    type: "credit",
    description: "Initial service credit",
    points: 0,
    creditCents: 10000,
    date: "Nov 14, 2026",
  },
];

export const rewardsSummary = {
  pointsOutstanding: 584200,
  liabilityCents: 5842000,
  creditsIssuedCents: 12480000,
  creditsRedeemedCents: 6638000,
};
