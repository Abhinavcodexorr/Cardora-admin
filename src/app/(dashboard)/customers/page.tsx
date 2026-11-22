import type { Metadata } from "next";
import { CustomersPanel } from "@/features/customers/customers-panel";
import { listCustomers } from "@/services/customers";

export const metadata: Metadata = { title: "Customers" };

export default async function CustomersPage() {
  const customers = await listCustomers();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted mt-1 text-sm">
          Profiles, purchased vehicles and onboarding status. All data is entered by
          staff.
        </p>
      </div>
      <CustomersPanel customers={customers} />
    </div>
  );
}
