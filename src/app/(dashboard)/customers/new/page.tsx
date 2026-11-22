import type { Metadata } from "next";
import { AddCustomerForm } from "@/features/customers/add-customer-form";

export const metadata: Metadata = { title: "Add customer" };

export default function NewCustomerPage() {
  return <AddCustomerForm />;
}
