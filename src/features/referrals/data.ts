export const stages = ["new", "contacted", "qualified", "converted"] as const;
export type Stage = (typeof stages)[number];
export const stageLabels: Record<Stage, string> = {
  new: "New lead",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
};

export type Referral = {
  id: string;
  name: string;
  phone: string;
  referredBy: string;
  interest: string;
  date: string;
  stage: Stage;
};

export const referrals: Referral[] = [
  {
    id: "r1",
    name: "Olivia Bennett",
    phone: "(416) 555-0121",
    referredBy: "Alex Morgan",
    interest: "2025 BMW X3",
    date: "Nov 21",
    stage: "new",
  },
  {
    id: "r2",
    name: "Marcus Lee",
    phone: "(647) 555-0175",
    referredBy: "Sarah Chen",
    interest: "2025 Audi Q3",
    date: "Nov 21",
    stage: "new",
  },
  {
    id: "r3",
    name: "Hannah Wright",
    phone: "(905) 555-0190",
    referredBy: "Emma Roberts",
    interest: "Used SUV under $40k",
    date: "Nov 20",
    stage: "new",
  },
  {
    id: "r4",
    name: "Tom Alvarez",
    phone: "(289) 555-0133",
    referredBy: "Alex Morgan",
    interest: "2024 Toyota Highlander",
    date: "Nov 18",
    stage: "contacted",
  },
  {
    id: "r5",
    name: "Grace Kim",
    phone: "(416) 555-0148",
    referredBy: "Mike Turner",
    interest: "2025 Honda Pilot",
    date: "Nov 17",
    stage: "contacted",
  },
  {
    id: "r6",
    name: "Liam Foster",
    phone: "(647) 555-0162",
    referredBy: "Sarah Chen",
    interest: "2025 Mazda CX-90",
    date: "Nov 14",
    stage: "qualified",
  },
  {
    id: "r7",
    name: "Nadia Haddad",
    phone: "(905) 555-0107",
    referredBy: "Emma Roberts",
    interest: "2024 BMW X5",
    date: "Nov 9",
    stage: "converted",
  },
];
