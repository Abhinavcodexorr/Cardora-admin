import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { listCustomers } from "@/services/customers";

export default async function DashboardLayout({ children }: LayoutProps<"/">) {
  const customers = (await listCustomers()).map((c) => ({
    id: c.id,
    name: c.fullName,
    detail: `${c.vehicle.year} ${c.vehicle.make} ${c.vehicle.model}`,
  }));
  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(70rem_28rem_at_85%_-8%,rgb(0_175_102/0.09),transparent)]">
        <Topbar customers={customers} />
        <main className="mx-auto w-full max-w-[1400px] flex-1 p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
