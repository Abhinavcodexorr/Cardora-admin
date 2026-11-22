import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CustomerProfile } from "@/features/customers/customer-profile";
import { listCustomers } from "@/services/customers";

export const metadata: Metadata = { title: "Customer" };

export async function generateStaticParams() {
  return (await listCustomers()).map((c) => ({ id: c.id }));
}

async function CustomerContent({
  params,
}: {
  params: PageProps<"/customers/[id]">["params"];
}) {
  const { id } = await params;
  const customer = (await listCustomers()).find((c) => c.id === id);
  if (!customer) notFound();
  return <CustomerProfile customer={customer} />;
}

export default function CustomerPage({ params }: PageProps<"/customers/[id]">) {
  return (
    <Suspense
      fallback={
        <div aria-busy className="h-[28rem] animate-pulse rounded-2xl bg-zinc-100" />
      }
    >
      <CustomerContent params={params} />
    </Suspense>
  );
}
