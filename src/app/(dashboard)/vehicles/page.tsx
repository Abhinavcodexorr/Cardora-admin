import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { VehiclesView } from "@/features/vehicles/vehicles-view";
import { listCustomers } from "@/services/customers";

export const metadata: Metadata = { title: "Vehicles" };

export default async function Page() {
  const customers = await listCustomers();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Vehicles"
        description="Every purchased vehicle in the program. Vehicles are added through a customer profile."
      />
      <VehiclesView customers={customers} />
    </div>
  );
}
