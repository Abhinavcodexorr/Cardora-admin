"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataView } from "@/components/ui/data-view";
import { uniqueOptions, type FilterDef, type SortDef } from "@/components/ui/filter-bar";
import { toTime } from "@/lib/dates";

import { Field, inputCls, textareaCls } from "@/components/ui/field";
import { StatusPicker } from "@/components/ui/status-picker";
import { Toggle } from "@/components/ui/toggle";
import { useToast } from "@/components/ui/toast";
import {
  advisors,
  serviceLabels,
  serviceRequests,
  serviceStatuses,
  type ServiceRequest,
  type ServiceStatus,
} from "./data";

const tone = {
  new: "blue",
  scheduled: "amber",
  in_progress: "amber",
  completed: "green",
} as const;

function Detail({
  r,
  onSave,
}: {
  r: ServiceRequest;
  onSave: (p: Partial<ServiceRequest>, msg: string) => void;
}) {
  const [status, setStatus] = useState<ServiceStatus>(r.status);
  const [advisor, setAdvisor] = useState(r.advisor);
  const [credit, setCredit] = useState(r.creditApplied);
  const [note, setNote] = useState("");
  return (
    <div className="space-y-5 text-sm">
      <dl className="grid grid-cols-2 gap-4">
        {[
          ["Customer", r.customer],
          ["Vehicle", r.vehicle],
          ["Service", r.type],
          ["Preferred date", r.preferred],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="text-muted text-xs">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
      {r.notes && (
        <p className="rounded-xl bg-zinc-50 p-3">
          <span className="text-muted block text-xs">Customer note</span>
          {r.notes}
        </p>
      )}
      <div>
        <h3 className="mb-2 font-semibold">Status</h3>
        <StatusPicker
          value={status}
          onChange={setStatus}
          options={serviceStatuses.map((s) => ({ id: s, label: serviceLabels[s] }))}
        />
      </div>
      <Field label="Service advisor">
        {(id) => (
          <select
            id={id}
            className={inputCls}
            value={advisor}
            onChange={(e) => setAdvisor(e.target.value)}
          >
            {advisors.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        )}
      </Field>
      <div className="border-line flex items-center justify-between rounded-xl border p-3">
        <span>
          <b>Apply service credit</b>
          <span className="text-muted block text-xs">
            Deduct from the customer&apos;s wallet
          </span>
        </span>
        <Toggle checked={credit} onChange={setCredit} label="Apply service credit" />
      </div>
      <Field label="Internal note">
        {(id) => (
          <textarea
            id={id}
            rows={3}
            className={textareaCls}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        )}
      </Field>
      <Button
        variant="primary"
        className="w-full"
        onClick={() =>
          onSave(
            { status, advisor, creditApplied: credit },
            `${r.id} updated (preview only)`,
          )
        }
      >
        Save changes
      </Button>
      <Link
        href={`/customers/${r.customerId}`}
        className="text-brand-600 block font-medium hover:underline"
      >
        Open customer profile →
      </Link>
    </div>
  );
}

function makeFilters(rows: ServiceRequest[]): {
  filters: FilterDef<ServiceRequest>[];
  sorts: SortDef<ServiceRequest>[];
} {
  return {
    filters: [
      {
        id: "type",
        label: "Service type",
        allLabel: "All services",
        options: uniqueOptions(rows, (r) => r.type),
        test: (r, v) => r.type === v,
      },
      {
        id: "adv",
        label: "Advisor",
        allLabel: "All advisors",
        options: uniqueOptions(rows, (r) => r.advisor),
        test: (r, v) => r.advisor === v,
      },
      {
        id: "credit",
        label: "Service credit",
        allLabel: "Any credit use",
        options: [
          { value: "yes", label: "Credit applied" },
          { value: "no", label: "No credit" },
        ],
        test: (r, v) => (v === "yes") === r.creditApplied,
      },
    ],
    sorts: [
      { id: "new", label: "Newest first", compare: () => 0 },
      {
        id: "date",
        label: "Preferred date (soonest)",
        compare: (a, b) => toTime(a.preferred) - toTime(b.preferred),
      },
      {
        id: "cust",
        label: "Customer (A–Z)",
        compare: (a, b) => a.customer.localeCompare(b.customer),
      },
    ],
  };
}

export function ServiceView() {
  const [rows, setRows] = useState(serviceRequests);
  const { filters, sorts } = useMemo(() => makeFilters(rows), [rows]);
  const [toast, show] = useToast();
  return (
    <>
      <DataView
        rows={rows}
        rowKey={(r) => r.id}
        searchText={(r) => `${r.id} ${r.customer} ${r.type} ${r.vehicle}`}
        searchPlaceholder="Search requests..."
        filters={filters}
        sorts={sorts}
        tabs={[
          { id: "all", label: "All" },
          ...serviceStatuses.map((s) => ({
            id: s,
            label: serviceLabels[s],
            filter: (r: ServiceRequest) => r.status === s,
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
            cell: (r) => (
              <>
                <span className="font-semibold">{r.customer}</span>
                <span className="text-muted block text-xs">{r.vehicle}</span>
              </>
            ),
          },
          { header: "Service", cell: (r) => r.type },
          { header: "Preferred", cell: (r) => r.preferred },
          {
            header: "Advisor",
            cell: (r) => <span className="text-muted">{r.advisor}</span>,
          },
          {
            header: "Status",
            cell: (r) => <Badge tone={tone[r.status]}>{serviceLabels[r.status]}</Badge>,
          },
        ]}
        detailTitle={(r) => r.type}
        detailSubtitle={(r) => `${r.id} · ${r.customer}`}
        detail={(r) => (
          <Detail
            key={r.id}
            r={r}
            onSave={(p, m) => {
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
