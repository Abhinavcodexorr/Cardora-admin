"use client";

import { Camera } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataView } from "@/components/ui/data-view";
import { uniqueOptions, type FilterDef, type SortDef } from "@/components/ui/filter-bar";

import { Field, inputCls } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { formatMoney } from "@/features/customers/types";
import {
  appraisalLabels,
  appraisals,
  appraisalStatuses,
  type Appraisal,
  type AppraisalStatus,
} from "./data";

const tone = {
  new: "blue",
  in_review: "amber",
  offer_sent: "amber",
  accepted: "green",
  declined: "gray",
} as const;

function Detail({
  a,
  set,
}: {
  a: Appraisal;
  set: (p: Partial<Appraisal>, msg: string) => void;
}) {
  const [offer, setOffer] = useState(a.offerCents ? String(a.offerCents / 100) : "");
  const valid = offer !== "" && Number(offer) > 0;
  return (
    <div className="space-y-5 text-sm">
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex aspect-square items-center justify-center rounded-xl bg-zinc-100 text-zinc-400"
          >
            <Camera className="size-6" strokeWidth={1.5} />
          </div>
        ))}
      </div>
      <dl className="grid grid-cols-2 gap-4">
        {[
          ["Customer", a.customer],
          ["Vehicle", a.vehicle],
          ["Odometer", `${a.odometerKm.toLocaleString()} km`],
          ["Condition", a.condition],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-muted text-xs">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      {a.notes && (
        <p className="rounded-xl bg-zinc-50 p-3">
          <span className="text-muted block text-xs">Customer note</span>
          {a.notes}
        </p>
      )}

      {a.status === "new" && (
        <Button
          variant="primary"
          className="w-full"
          onClick={() => set({ status: "in_review" }, `${a.id} moved to review`)}
        >
          Start review
        </Button>
      )}
      {(a.status === "in_review" || a.status === "offer_sent") && (
        <div className="space-y-3">
          <Field label="Offer amount (CAD)">
            {(id) => (
              <input
                id={id}
                className={inputCls}
                inputMode="decimal"
                value={offer}
                onChange={(e) => setOffer(e.target.value)}
              />
            )}
          </Field>
          <Button
            variant="primary"
            className="w-full"
            disabled={!valid}
            onClick={() =>
              set(
                { status: "offer_sent", offerCents: Math.round(Number(offer) * 100) },
                "Offer sent to the customer's app (demo)",
              )
            }
          >
            {a.status === "offer_sent" ? "Update offer" : "Send offer"}
          </Button>
        </div>
      )}
      {a.status === "offer_sent" && (
        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={() => set({ status: "accepted" }, "Marked as accepted")}
          >
            Mark accepted
          </Button>
          <Button
            className="flex-1"
            onClick={() => set({ status: "declined" }, "Marked as declined")}
          >
            Mark declined
          </Button>
        </div>
      )}
      {(a.status === "accepted" || a.status === "declined") && a.offerCents && (
        <p className="rounded-xl bg-zinc-50 p-3">
          Final offer <b>{formatMoney(a.offerCents)}</b> was{" "}
          <b>{appraisalLabels[a.status].toLowerCase()}</b>.
        </p>
      )}
      <Link
        href={`/customers/${a.customerId}`}
        className="text-brand-600 block font-medium hover:underline"
      >
        Open customer profile →
      </Link>
    </div>
  );
}

function makeFilters(rows: Appraisal[]): {
  filters: FilterDef<Appraisal>[];
  sorts: SortDef<Appraisal>[];
} {
  return {
    filters: [
      {
        id: "cond",
        label: "Condition",
        allLabel: "Any condition",
        options: uniqueOptions(rows, (r) => r.condition),
        test: (r, v) => r.condition === v,
      },
      {
        id: "offer",
        label: "Offer",
        allLabel: "Any offer status",
        options: [
          { value: "yes", label: "Offer made" },
          { value: "no", label: "No offer yet" },
        ],
        test: (r, v) => (v === "yes") === Boolean(r.offerCents),
      },
      {
        id: "cust",
        label: "Customer",
        allLabel: "All customers",
        options: uniqueOptions(rows, (r) => r.customer),
        test: (r, v) => r.customer === v,
      },
    ],
    sorts: [
      { id: "new", label: "Newest first", compare: () => 0 },
      {
        id: "offer",
        label: "Offer (high → low)",
        compare: (a, b) => (b.offerCents ?? 0) - (a.offerCents ?? 0),
      },
      {
        id: "odo",
        label: "Odometer (low → high)",
        compare: (a, b) => a.odometerKm - b.odometerKm,
      },
    ],
  };
}

export function AppraisalsView() {
  const [rows, setRows] = useState(appraisals);
  const { filters, sorts } = useMemo(() => makeFilters(rows), [rows]);
  const [toast, show] = useToast();
  return (
    <>
      <DataView
        rows={rows}
        rowKey={(r) => r.id}
        searchText={(r) => `${r.id} ${r.customer} ${r.vehicle}`}
        searchPlaceholder="Search appraisals..."
        filters={filters}
        sorts={sorts}
        tabs={[
          { id: "all", label: "All" },
          ...appraisalStatuses.map((s: AppraisalStatus) => ({
            id: s,
            label: appraisalLabels[s],
            filter: (r: Appraisal) => r.status === s,
          })),
        ]}
        columns={[
          {
            header: "Request",
            cell: (r) => (
              <>
                <span className="font-mono text-xs">{r.id}</span>
                <span className="text-muted block text-xs">{r.created}</span>
              </>
            ),
          },
          {
            header: "Customer",
            cell: (r) => <span className="font-semibold">{r.customer}</span>,
          },
          {
            header: "Trade-in vehicle",
            cell: (r) => (
              <>
                {r.vehicle}
                <span className="text-muted block text-xs">
                  {r.odometerKm.toLocaleString()} km · {r.condition}
                </span>
              </>
            ),
          },
          {
            header: "Offer",
            cell: (r) =>
              r.offerCents ? (
                <b>{formatMoney(r.offerCents)}</b>
              ) : (
                <span className="text-muted">—</span>
              ),
          },
          {
            header: "Status",
            cell: (r) => <Badge tone={tone[r.status]}>{appraisalLabels[r.status]}</Badge>,
          },
        ]}
        detailTitle={(r) => r.vehicle}
        detailSubtitle={(r) => `${r.id} · ${r.customer}`}
        detail={(r) => (
          <Detail
            key={r.id + r.status}
            a={r}
            set={(p, m) => {
              setRows((l) => l.map((x) => (x.id === r.id ? { ...x, ...p } : x)));
              show(m);
            }}
          />
        )}
      />
      {toast}
    </>
  );
}
