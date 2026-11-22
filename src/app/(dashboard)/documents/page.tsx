import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { DocumentsView } from "@/features/documents/documents-view";
import { listCustomers } from "@/services/customers";

export const metadata: Metadata = { title: "Documents" };

export default async function Page() {
  const customers = await listCustomers();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Ownership, insurance and sales documents uploaded by staff."
      />
      <DocumentsView customers={customers} />
    </div>
  );
}
