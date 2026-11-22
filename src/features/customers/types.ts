/**
 * Onboarding lifecycle (per Cardora spec):
 * Profile Incomplete → Ready to Invite → Invitation Sent → Activated → Delivery Complete
 */
export const customerStatuses = [
  "profile_incomplete",
  "ready_to_invite",
  "invitation_sent",
  "activated",
  "delivery_complete",
] as const;
export type CustomerStatus = (typeof customerStatuses)[number];

export const statusLabels: Record<CustomerStatus, string> = {
  profile_incomplete: "Profile Incomplete",
  ready_to_invite: "Ready to Invite",
  invitation_sent: "Invitation Sent",
  activated: "Activated",
  delivery_complete: "Delivery Complete",
};

export type Vehicle = {
  year: number;
  make: string;
  model: string;
  trim: string;
  vin: string;
  stockNumber?: string;
  color?: string;
  odometerKm: number;
  purchaseDate: string;
  deliveryDate: string;
  deliveryLocation: string;
};

export type ProtectionPackage = {
  id: string;
  name: string;
  contractNumber: string;
  expires: string;
  active: boolean;
};

export type CustomerDocument = { id: string; name: string; uploaded: string };

export type Customer = {
  id: string; // unique customer ID e.g. CDR-10482
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  status: CustomerStatus;
  vehicle: Vehicle;
  packages: ProtectionPackage[];
  documents: CustomerDocument[];
  rewardPoints: number;
  serviceCreditCents: number; // default $100 initial credit (configurable)
  lastActivity: string;
};

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export const formatMoney = (cents: number) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(
    cents / 100,
  );
