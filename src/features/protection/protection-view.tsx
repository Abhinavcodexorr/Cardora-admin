"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { DataView } from "@/components/ui/data-view";
import { uniqueOptions, type FilterDef, type SortDef } from "@/components/ui/filter-bar";
import { toTime } from "@/lib/dates";

import type { Customer } from "@/features/customers/types";
import { daysUntil } from "@/lib/dates";
import { toPackageRows, type PackageRow } from "./rows";

const tone = { active: "green", expiring: "amber", expired: "gray" } as const;
const label = {
  active: "Active",
  expiring: "Expiring soon",
  expired: "Expired",
} as const;

function makeFilters(rows: PackageRow[]): {
  filters: FilterDef<PackageRow>[];
  sorts: SortDef<PackageRow>[];
} {
  return {
    filters: [
      {
        id: "product",
        label: "Product",
        allLabel: "All products",
        options: uniqueOptions(rows, (r) => r.name),
        test: (r, v) => r.name === v,
      },
      {
        id: "window",
        label: "Expiry window",
        allLabel: "Any expiry",
        options: [
          { value: "past", label: "Already expired" },
          { value: "30", label: "Next 30 days" },
          { value: "90", label: "Next 90 days" },
          { value: "180", label: "Next 6 months" },
          { value: "365", label: "Next 12 months" },
        ],
        test: (r, v) => {
          const d = daysUntil(r.expires);
          return v === "past" ? d < 0 : d >= 0 && d <= Number(v);
        },
      },
      {
        id: "make",
        label: "Vehicle make",
        allLabel: "All makes",
        options: uniqueOptions(rows, (r) => r.owner.vehicle.make),
        test: (r, v) => r.owner.vehicle.make === v,
      },
      {
        id: "cust",
        label: "Customer",
        allLabel: "All customers",
        options: uniqueOptions(rows, (r) => r.owner.fullName),
        test: (r, v) => r.owner.fullName === v,
      },
    ],
    sorts: [
      {
        id: "soon",
        label: "Expiry (soonest)",
        compare: (a, b) => toTime(a.expires) - toTime(b.expires),
      },
      {
        id: "late",
        label: "Expiry (latest)",
        compare: (a, b) => toTime(b.expires) - toTime(a.expires),
      },
      {
        id: "cust",
        label: "Customer (A–Z)",
        compare: (a, b) => a.owner.fullName.localeCompare(b.owner.fullName),
      },
      {
        id: "prod",
        label: "Product (A–Z)",
        compare: (a, b) => a.name.localeCompare(b.name),
      },
    ],
  };
}

export function ProtectionView({ customers }: { customers: Customer[] }) {
  const rows = useMemo(() => toPackageRows(customers), [customers]);
  const { filters, sorts } = useMemo(() => makeFilters(rows), [rows]);
  return (
    <DataView
      rows={rows}
      rowKey={(r) => r.id}
      searchText={(r) => `${r.name} ${r.contractNumber} ${r.owner.fullName}`}
      searchPlaceholder="Search contract, product or customer..."
      filters={filters}
      sorts={sorts}
      tabs={[
        { id: "all", label: "All contracts" },
        { id: "active", label: "Active", filter: (r) => r.state === "active" },
        {
          id: "expiring",
          label: "Expiring (90 days)",
          filter: (r) => r.state === "expiring",
        },
        { id: "expired", label: "Expired", filter: (r) => r.state === "expired" },
      ]}
      columns={[
        {
          header: "Product",
          cell: (r) => (
            <div className="flex items-center gap-3">
              <span className="bg-brand-50 text-brand-600 flex size-9 items-center justify-center rounded-full">
                <ShieldCheck className="size-5" strokeWidth={1.75} />
              </span>
              <span className="font-semibold">{r.name}</span>
            </div>
          ),
        },
        {
          header: "Contract #",
          cell: (r) => <span className="font-mono text-xs">{r.contractNumber}</span>,
        },
        {
          header: "Customer",
          cell: (r) => (
            <Link
              href={`/customers/${r.owner.id}`}
              onClick={(e) => e.stopPropagation()}
              className="hover:text-brand-600 font-medium hover:underline"
            >
              {r.owner.fullName}
            </Link>
          ),
        },
        {
          header: "Vehicle",
          cell: (r) =>
            `${r.owner.vehicle.year} ${r.owner.vehicle.make} ${r.owner.vehicle.model}`,
        },
        {
          header: "Expires",
          cell: (r) => (
            <>
              <span className="block">{r.expires}</span>
              <span className="text-muted text-xs">
                {daysUntil(r.expires) < 0
                  ? `${-daysUntil(r.expires)} days ago`
                  : `in ${daysUntil(r.expires)} days`}
              </span>
            </>
          ),
        },
        {
          header: "Status",
          cell: (r) => <Badge tone={tone[r.state]}>{label[r.state]}</Badge>,
        },
      ]}
      detailTitle={(r) => r.name}
      detailSubtitle={(r) => r.contractNumber}
      detail={(r) => (
        <div className="space-y-5 text-sm">
          <Badge tone={tone[r.state]}>{label[r.state]}</Badge>
          <dl className="grid grid-cols-2 gap-4">
            {[
              ["Contract #", r.contractNumber],
              ["Expires", r.expires],
              ["Customer", r.owner.fullName],
              [
                "Vehicle",
                `${r.owner.vehicle.year} ${r.owner.vehicle.make} ${r.owner.vehicle.model}`,
              ],
              ["VIN", r.owner.vehicle.vin],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted text-xs">{k}</dt>
                <dd className="font-medium break-all">{v}</dd>
              </div>
            ))}
          </dl>
          <Link
            href={`/customers/${r.owner.id}`}
            className="text-brand-600 font-medium hover:underline"
          >
            Open customer profile →
          </Link>
        </div>
      )}
    />
  );
}
