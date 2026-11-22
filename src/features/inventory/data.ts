export type Listing = {
  id: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  priceCents: number;
  km: number;
  stock: string;
  color?: string;
  badge?: string;
};

/** Read-only feed from the Cardora IMS (available-for-sale inventory only). */
export const listings: Listing[] = [
  {
    id: "l1",
    year: 2025,
    make: "BMW",
    model: "X3",
    trim: "xDrive30i",
    priceCents: 5895000,
    km: 12,
    stock: "B2501",
    color: "Alpine White",
    badge: "New arrival",
  },
  {
    id: "l2",
    year: 2024,
    make: "Audi",
    model: "Q5",
    trim: "Progressiv",
    priceCents: 5299500,
    km: 14200,
    stock: "A2417",
    color: "Navarra Blue",
  },
  {
    id: "l3",
    year: 2025,
    make: "Toyota",
    model: "RAV4",
    trim: "Hybrid XLE",
    priceCents: 4489900,
    km: 8,
    stock: "T2509",
    color: "Cavalry Blue",
    badge: "New arrival",
  },
  {
    id: "l4",
    year: 2023,
    make: "Honda",
    model: "CR-V",
    trim: "Touring",
    priceCents: 3699900,
    km: 31800,
    stock: "H2312",
    color: "Platinum White",
  },
  {
    id: "l5",
    year: 2024,
    make: "Hyundai",
    model: "Tucson",
    trim: "Preferred AWD",
    priceCents: 3849900,
    km: 9400,
    stock: "Y2406",
    color: "Amazon Gray",
  },
  {
    id: "l6",
    year: 2022,
    make: "Mazda",
    model: "CX-5",
    trim: "GT",
    priceCents: 3299500,
    km: 45600,
    stock: "M2208",
    color: "Soul Red",
  },
  {
    id: "l7",
    year: 2025,
    make: "BMW",
    model: "X5",
    trim: "xDrive40i",
    priceCents: 8195000,
    km: 20,
    stock: "B2514",
    color: "Black Sapphire",
  },
  {
    id: "l8",
    year: 2023,
    make: "Audi",
    model: "A4",
    trim: "Komfort",
    priceCents: 3995000,
    km: 27100,
    stock: "A2309",
  },
  {
    id: "l9",
    year: 2024,
    make: "Toyota",
    model: "Highlander",
    trim: "XLE",
    priceCents: 5649900,
    km: 11900,
    stock: "T2411",
  },
];
