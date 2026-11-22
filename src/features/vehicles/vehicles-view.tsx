"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { DataView } from "@/components/ui/data-view";
import { uniqueOptions, type FilterDef, type SortDef } from "@/components/ui/filter-bar";
import { toTime } from "@/lib/dates";

import { CarImage } from "@/components/ui/car-image";
import { VehicleThumb } from "@/features/customers/vehicle-thumb";
import type { Customer, Vehicle } from "@/features/customers/types";
import { Plus } from "lucide-react";

type Row = { owner: Customer; v: Vehicle };

function makeFilters(rows: Row[]): { filters: FilterDef<Row>[]; sorts: SortDef<Row>[] } {
  return {
    filters: [
      {
        id: "make",
        label: "Make",
        allLabel: "All makes",
        options: uniqueOptions(rows, (r) => r.v.make),
        test: (r, v) => r.v.make === v,
      },
      {
        id: "year",
        label: "Year",
        allLabel: "All years",
        options: uniqueOptions(rows, (r) => r.v.year).reverse(),
        test: (r, v) => String(r.v.year) === v,
      },
      {
        id: "loc",
        label: "Delivery location",
        allLabel: "All locations",
        options: uniqueOptions(rows, (r) => r.v.deliveryLocation),
        test: (r, v) => r.v.deliveryLocation === v,
      },
      {
        id: "prot",
        label: "Protection",
        allLabel: "Any protection",
        options: [
          { value: "yes", label: "With protection" },
          { value: "no", label: "No protection" },
        ],
        test: (r, v) => (v === "yes") === r.owner.packages.length > 0,
      },
    ],
    sorts: [
      {
        id: "delivered",
        label: "Delivered (newest)",
        compare: (a, b) => toTime(b.v.deliveryDate) - toTime(a.v.deliveryDate),
      },
      { id: "year", label: "Year (newest)", compare: (a, b) => b.v.year - a.v.year },
      {
        id: "odo",
        label: "Odometer (low → high)",
        compare: (a, b) => a.v.odometerKm - b.v.odometerKm,
      },
      {
        id: "owner",
        label: "Owner (A–Z)",
        compare: (a, b) => a.owner.fullName.localeCompare(b.owner.fullName),
      },
    ],
  };
}

export function VehiclesView({ customers }: { customers: Customer[] }) {
  const rows = useMemo<Row[]>(
    () => customers.map((c) => ({ owner: c, v: c.vehicle })),
    [customers],
  );
  const { filters, sorts } = useMemo(() => makeFilters(rows), [rows]);
  return (
    <DataView
      rows={rows}
      rowKey={(r) => r.v.vin}
      searchText={(r) =>
        `${r.v.year} ${r.v.make} ${r.v.model} ${r.v.vin} ${r.owner.fullName}`
      }
      searchPlaceholder="Search by make, model, VIN or owner..."
      filters={filters}
      sorts={sorts}
      toolbar={
        <Link href="/customers/new" className={buttonStyles("primary")}>
          <Plus className="size-4" /> Add via customer
        </Link>
      }
      tabs={[
        { id: "all", label: "All vehicles" },
        {
          id: "protected",
          label: "With protection",
          filter: (r) => r.owner.packages.length > 0,
        },
        {
          id: "none",
          label: "No protection",
          filter: (r) => r.owner.packages.length === 0,
        },
      ]}
      columns={[
        {
          header: "Vehicle",
          cell: (r) => (
            <div className="flex items-center gap-3">
              <VehicleThumb
                make={r.v.make}
                model={r.v.model}
                seed={r.v.vin}
                color={r.v.color}
              />
              <div>
                <p className="font-semibold">
                  {r.v.year} {r.v.make} {r.v.model}
                </p>
                <p className="text-muted font-mono text-[11px]">VIN: {r.v.vin}</p>
              </div>
            </div>
          ),
        },
        {
          header: "Owner",
          cell: (r) => <span className="font-medium">{r.owner.fullName}</span>,
        },
        {
          header: "Delivered",
          cell: (r) => (
            <>
              <span className="block">{r.v.deliveryDate}</span>
              <span className="text-muted text-xs">{r.v.deliveryLocation}</span>
            </>
          ),
        },
        { header: "Odometer", cell: (r) => `${r.v.odometerKm.toLocaleString()} km` },
        {
          header: "Protection",
          cell: (r) =>
            r.owner.packages.length ? (
              <Badge>{r.owner.packages.length} active</Badge>
            ) : (
              <Badge tone="gray">None</Badge>
            ),
        },
      ]}
      detailTitle={(r) => `${r.v.year} ${r.v.make} ${r.v.model}`}
      detailSubtitle={(r) => r.v.trim}
      detail={(r) => (
        <div className="space-y-6">
          <CarImage
            make={r.v.make}
            model={r.v.model}
            seed={r.v.vin}
            color={r.v.color}
            className="h-52 w-full rounded-2xl"
          />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {[
              ["VIN", r.v.vin],
              ["Stock #", r.v.stockNumber ?? "—"],
              ["Purchase date", r.v.purchaseDate],
              ["Delivery date", r.v.deliveryDate],
              ["Delivery location", r.v.deliveryLocation],
              ["Odometer at delivery", `${r.v.odometerKm.toLocaleString()} km`],
            ].map(([k, val]) => (
              <div key={k}>
                <dt className="text-muted text-xs">{k}</dt>
                <dd className="font-medium break-all">{val}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h3 className="mb-2 font-semibold">Owner</h3>
            <Link
              href={`/customers/${r.owner.id}`}
              className="border-line flex items-center justify-between rounded-xl border p-3 text-sm hover:bg-zinc-50"
            >
              <span>
                <b>{r.owner.fullName}</b>
                <span className="text-muted block text-xs">
                  {r.owner.id} · {r.owner.mobile}
                </span>
              </span>
              <span className="text-brand-600 font-medium">View profile →</span>
            </Link>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Protection ({r.owner.packages.length})</h3>
            <ul className="space-y-2 text-sm">
              {r.owner.packages.map((p) => (
                <li
                  key={p.id}
                  className="border-line flex justify-between rounded-xl border p-3"
                >
                  <span>{p.name}</span>
                  <span className="text-muted">Exp. {p.expires}</span>
                </li>
              ))}
              {r.owner.packages.length === 0 && (
                <li className="text-muted">No protection products attached.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    />
  );
}
