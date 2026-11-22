"use client";

import { Download, FileText, Upload } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DataView } from "@/components/ui/data-view";
import { uniqueOptions, type FilterDef, type SortDef } from "@/components/ui/filter-bar";
import { toTime } from "@/lib/dates";

import { Drawer } from "@/components/ui/drawer";
import { Field, inputCls } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import type { Customer, CustomerDocument } from "@/features/customers/types";

type Row = CustomerDocument & { owner: Customer };
const docTypes = [
  "Ownership (Registration)",
  "Proof of Insurance",
  "Bill of Sale",
  "Warranty Contract",
];

function makeFilters(rows: Row[]): { filters: FilterDef<Row>[]; sorts: SortDef<Row>[] } {
  return {
    filters: [
      {
        id: "type",
        label: "Document type",
        allLabel: "All types",
        options: uniqueOptions(rows, (r) => r.name),
        test: (r, v) => r.name === v,
      },
      {
        id: "cust",
        label: "Customer",
        allLabel: "All customers",
        options: uniqueOptions(rows, (r) => r.owner.fullName),
        test: (r, v) => r.owner.fullName === v,
      },
      {
        id: "make",
        label: "Vehicle make",
        allLabel: "All makes",
        options: uniqueOptions(rows, (r) => r.owner.vehicle.make),
        test: (r, v) => r.owner.vehicle.make === v,
      },
    ],
    sorts: [
      {
        id: "new",
        label: "Uploaded (newest)",
        compare: (a, b) => toTime(b.uploaded) - toTime(a.uploaded),
      },
      {
        id: "old",
        label: "Uploaded (oldest)",
        compare: (a, b) => toTime(a.uploaded) - toTime(b.uploaded),
      },
      {
        id: "cust",
        label: "Customer (A–Z)",
        compare: (a, b) => a.owner.fullName.localeCompare(b.owner.fullName),
      },
      {
        id: "type",
        label: "Type (A–Z)",
        compare: (a, b) => a.name.localeCompare(b.name),
      },
    ],
  };
}

export function DocumentsView({ customers }: { customers: Customer[] }) {
  const [extra, setExtra] = useState<Row[]>([]);
  const [uploading, setUploading] = useState(false);
  const [toast, show] = useToast();
  const [owner, setOwner] = useState(customers[0].id);
  const [type, setType] = useState(docTypes[0]);
  const [file, setFile] = useState("");

  const rows = useMemo<Row[]>(
    () => [
      ...extra,
      ...customers.flatMap((c) => c.documents.map((d) => ({ ...d, owner: c }))),
    ],
    [customers, extra],
  );
  const { filters, sorts } = useMemo(() => makeFilters(rows), [rows]);
  const match = (k: string) => (r: Row) => r.name.toLowerCase().includes(k);

  return (
    <>
      <DataView
        rows={rows}
        rowKey={(r) => r.id}
        searchText={(r) => `${r.name} ${r.owner.fullName}`}
        searchPlaceholder="Search documents or customers..."
        filters={filters}
        sorts={sorts}
        toolbar={
          <Button variant="primary" onClick={() => setUploading(true)}>
            <Upload className="size-4" /> Upload document
          </Button>
        }
        tabs={[
          { id: "all", label: "All documents" },
          { id: "own", label: "Ownership", filter: match("ownership") },
          { id: "ins", label: "Insurance", filter: match("insurance") },
          { id: "sale", label: "Bill of Sale", filter: match("bill of sale") },
          { id: "war", label: "Warranty", filter: match("warranty") },
        ]}
        columns={[
          {
            header: "Document",
            cell: (r) => (
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-zinc-500" strokeWidth={1.5} />
                <span className="font-semibold">{r.name}</span>
              </div>
            ),
          },
          {
            header: "Customer",
            cell: (r) => (
              <Link
                href={`/customers/${r.owner.id}`}
                onClick={(e) => e.stopPropagation()}
                className="hover:text-brand-600 hover:underline"
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
          { header: "Uploaded", cell: (r) => r.uploaded },
          {
            header: "",
            cell: () => <Download className="text-muted size-4" aria-label="Download" />,
            className: "text-right",
          },
        ]}
        detailTitle={(r) => r.name}
        detailSubtitle={(r) => `${r.owner.fullName} · uploaded ${r.uploaded}`}
        detail={(r) => (
          <div className="space-y-5">
            <div className="flex h-72 flex-col items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
              <FileText className="size-14" strokeWidth={1.25} />
              <span className="mt-2 text-sm">Document preview</span>
            </div>
            <Button
              variant="dark"
              className="w-full"
              onClick={() => show("Download started (demo)")}
            >
              <Download className="size-4" /> Download
            </Button>
            <Link
              href={`/customers/${r.owner.id}`}
              className="text-brand-600 block text-sm font-medium hover:underline"
            >
              Open {r.owner.fullName}&apos;s profile →
            </Link>
          </div>
        )}
      />
      {uploading && (
        <Drawer
          title="Upload document"
          subtitle="Attach to a customer's account"
          onClose={() => setUploading(false)}
          footer={
            <div className="flex justify-end gap-2">
              <Button onClick={() => setUploading(false)}>Cancel</Button>
              <Button
                variant="primary"
                disabled={!file}
                onClick={() => {
                  const c = customers.find((x) => x.id === owner)!;
                  setExtra((l) => [
                    {
                      id: `u${l.length}`,
                      name: type,
                      uploaded: "Nov 22, 2026",
                      owner: c,
                    },
                    ...l,
                  ]);
                  setUploading(false);
                  setFile("");
                  show("Document added (preview only, not stored)");
                }}
              >
                Upload
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Field label="Customer">
              {(id) => (
                <select
                  id={id}
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  className={inputCls}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.id})
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field label="Document type">
              {(id) => (
                <select
                  id={id}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className={inputCls}
                >
                  {docTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              )}
            </Field>
            <label className="border-line hover:border-brand-500 flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-dashed p-6 text-center text-sm">
              <Upload className="text-brand-600 size-6" />
              <span className="font-medium">{file || "Choose a file"}</span>
              <span className="text-muted text-xs">PDF, JPG or PNG</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="sr-only"
                onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")}
              />
            </label>
          </div>
        </Drawer>
      )}
      {toast}
    </>
  );
}
