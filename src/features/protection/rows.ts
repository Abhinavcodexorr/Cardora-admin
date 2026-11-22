import type { Customer, ProtectionPackage } from "@/features/customers/types";
import { expiryState, type Expiry } from "@/lib/dates";

export type PackageRow = ProtectionPackage & { owner: Customer; state: Expiry };

export function toPackageRows(customers: Customer[]): PackageRow[] {
  return customers.flatMap((c) =>
    c.packages.map((p) => ({ ...p, owner: c, state: expiryState(p.expires) })),
  );
}
