"use client";

import { VehicleThumb } from "./vehicle-thumb";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  applyFilters,
  FilterBar,
  uniqueOptions,
  type FilterDef,
  type SortDef,
} from "@/components/ui/filter-bar";
import { TabBar } from "@/components/ui/tab-bar";
import { toTime } from "@/lib/dates";
import { CustomerDrawer } from "./customer-drawer";
import { StatusBadge } from "./status-badge";
import {
  customerStatuses,
  formatMoney,
  statusLabels,
  type Customer,
  type CustomerStatus,
} from "./types";

const tabs: { id: string; label: string; match: CustomerStatus[] | null }[] = [
  { id: "all", label: "All Customers", match: null },
  { id: "active", label: "Activated", match: ["activated", "delivery_complete"] },
  {
    id: "pending",
    label: "Pending Activation",
    match: ["ready_to_invite", "invitation_sent"],
  },
  { id: "incomplete", label: "Incomplete", match: ["profile_incomplete"] },
];

function makeFilters(rows: Customer[]): {
  filters: FilterDef<Customer>[];
  sorts: SortDef<Customer>[];
} {
  return {
    filters: [
      {
        id: "status",
        label: "Status",
        allLabel: "Any status",
        options: customerStatuses.map((s) => ({ value: s, label: statusLabels[s] })),
        test: (c, v) => c.status === v,
      },
      {
        id: "make",
        label: "Vehicle make",
        allLabel: "All makes",
        options: uniqueOptions(rows, (c) => c.vehicle.make),
        test: (c, v) => c.vehicle.make === v,
      },
      {
        id: "year",
        label: "Vehicle year",
        allLabel: "All years",
        options: uniqueOptions(rows, (c) => c.vehicle.year).reverse(),
        test: (c, v) => String(c.vehicle.year) === v,
      },
      {
        id: "loc",
        label: "Delivery location",
        allLabel: "All locations",
        options: uniqueOptions(rows, (c) => c.vehicle.deliveryLocation),
        test: (c, v) => c.vehicle.deliveryLocation === v,
      },
      {
        id: "prot",
        label: "Protection",
        allLabel: "Any protection",
        options: [
          { value: "yes", label: "With protection" },
          { value: "no", label: "No protection" },
        ],
        test: (c, v) => (v === "yes") === c.packages.length > 0,
      },
      {
        id: "rewards",
        label: "Rewards",
        allLabel: "Any rewards",
        options: [
          { value: "pts", label: "Has points" },
          { value: "none", label: "No points" },
          { value: "credit", label: "Has service credit" },
        ],
        test: (c, v) =>
          v === "pts"
            ? c.rewardPoints > 0
            : v === "none"
              ? c.rewardPoints === 0
              : c.serviceCreditCents > 0,
      },
      {
        id: "docs",
        label: "Documents",
        allLabel: "Any documents",
        options: [
          { value: "yes", label: "Has documents" },
          { value: "no", label: "No documents" },
        ],
        test: (c, v) => (v === "yes") === c.documents.length > 0,
      },
    ],
    sorts: [
      { id: "default", label: "Recently added", compare: () => 0 },
      {
        id: "name",
        label: "Name (A–Z)",
        compare: (a, b) => a.fullName.localeCompare(b.fullName),
      },
      {
        id: "rewards",
        label: "Rewards (high → low)",
        compare: (a, b) => b.rewardPoints - a.rewardPoints,
      },
      {
        id: "delivered",
        label: "Delivered (newest)",
        compare: (a, b) =>
          toTime(b.vehicle.deliveryDate) - toTime(a.vehicle.deliveryDate),
      },
      {
        id: "odo",
        label: "Odometer (low → high)",
        compare: (a, b) => a.vehicle.odometerKm - b.vehicle.odometerKm,
      },
    ],
  };
}

export function CustomersPanel({ customers }: { customers: Customer[] }) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Customer | null>(null);
  const [fv, setFv] = useState<Record<string, string>>({});
  const [sortId, setSortId] = useState("default");
  const { filters, sorts } = useMemo(() => makeFilters(customers), [customers]);

  const matches = (c: Customer, ids: CustomerStatus[] | null) =>
    !ids || ids.includes(c.status);
  const rows = useMemo(() => {
    const match = tabs.find((t) => t.id === tab)?.match ?? null;
    const q = query.trim().toLowerCase();
    const base = customers.filter(
      (c) =>
        matches(c, match) &&
        (!q ||
          [
            c.fullName,
            c.id,
            c.mobile,
            c.email,
            c.vehicle.vin,
            c.vehicle.model,
            c.vehicle.make,
          ]
            .join(" ")
            .toLowerCase()
            .includes(q)),
    );
    return applyFilters(base, filters, fv, sorts, sortId);
  }, [customers, tab, query, filters, fv, sorts, sortId]);

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Customers</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search customers"
              placeholder="Search customers..."
              className="border-line focus:border-brand-500 h-10 w-56 rounded-xl border pr-3 pl-9 text-sm outline-none"
            />
          </div>
          <Link href="/customers/new" className={buttonStyles("primary")}>
            <Plus className="size-4" /> Add Customer
          </Link>
        </div>
      </div>

      <TabBar
        className="mt-4"
        value={tab}
        onChange={setTab}
        tabs={tabs.map((t) => ({
          id: t.id,
          label: t.label,
          count: customers.filter((c) => matches(c, t.match)).length,
        }))}
      />
      <FilterBar
        filters={filters}
        values={fv}
        onChange={(id, v) => setFv((p) => ({ ...p, [id]: v }))}
        sorts={sorts}
        sort={sortId}
        onSort={setSortId}
        onClear={() => setFv({})}
        shown={rows.length}
        total={customers.length}
      />

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-muted text-xs">
            <tr>
              {["Customer", "Vehicle", "Status", "Rewards", "Last Activity", ""].map(
                (h, i) => (
                  <th key={i} scope="col" className="py-3 font-medium">
                    {h || <span className="sr-only">Actions</span>}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-line divide-y">
            {rows.map((c) => (
              <tr
                key={c.id}
                onClick={() => setSelected(c)}
                className="cursor-pointer hover:bg-zinc-50"
              >
                <td className="py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(c);
                    }}
                    className="flex items-center gap-3 text-left"
                  >
                    <Avatar name={c.fullName} />
                    <span>
                      <span className="block font-semibold">{c.fullName}</span>
                      <span className="text-muted block text-xs">{c.mobile}</span>
                    </span>
                  </button>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <VehicleThumb
                      make={c.vehicle.make}
                      model={c.vehicle.model}
                      seed={c.vehicle.vin}
                      color={c.vehicle.color}
                      className="h-10 w-16"
                    />
                    <span>
                      <span className="block font-semibold">
                        {c.vehicle.year} {c.vehicle.make} {c.vehicle.model}
                      </span>
                      <span className="text-muted block font-mono text-[11px]">
                        VIN: {c.vehicle.vin}
                      </span>
                    </span>
                  </div>
                </td>
                <td className="py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="py-3">
                  <span className="block font-semibold">
                    {c.rewardPoints.toLocaleString()} pts
                  </span>
                  <span className="text-muted block text-xs">
                    {formatMoney(c.serviceCreditCents)} credit
                  </span>
                </td>
                <td className="text-muted py-3">{c.lastActivity}</td>
                <td className="py-3 text-right">
                  <MoreHorizontal className="text-muted inline size-5" aria-hidden />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-muted py-10 text-center">
                  No customers match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <CustomerDrawer customer={selected} onClose={() => setSelected(null)} />
      )}
    </Card>
  );
}
