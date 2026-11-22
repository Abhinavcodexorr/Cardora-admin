"use client";

import { CarImage } from "@/components/ui/car-image";
import {
  ChevronRight,
  Download,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Send,
  ShieldCheck,
  Upload,
  Wallet,
  X,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { StatusBadge } from "./status-badge";
import { formatMoney, type Customer } from "./types";

const tabs = ["Overview", "Packages", "Documents", "Rewards", "Activity"] as const;
type Tab = (typeof tabs)[number];

function SectionHead({
  title,
  action,
  icon: Icon,
}: {
  title: string;
  action?: string;
  icon?: typeof Plus;
}) {
  return (
    <div className="mt-6 mb-2 flex items-center justify-between">
      <h3 className="font-semibold">{title}</h3>
      {action && (
        <button className="text-brand-600 inline-flex items-center gap-1 text-sm font-medium hover:underline">
          {Icon && <Icon className="size-4" />} {action}
        </button>
      )}
    </div>
  );
}

export function CustomerDrawer({
  customer: c,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<Tab>("Overview");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const missing = [!c.email && "email", !c.address && "address"].filter(
    Boolean,
  ) as string[];
  const canInvite = missing.length === 0 && c.status !== "profile_incomplete";
  const show = (t: Tab) => tab === "Overview" || tab === t;

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`${c.fullName} profile`}
        className="animate-slide-in bg-surface absolute inset-y-0 right-0 flex w-full max-w-[480px] flex-col shadow-2xl"
      >
        <div className="overflow-y-auto p-6 pb-4">
          <div className="flex items-start gap-4">
            <Avatar name={c.fullName} className="size-14 text-lg" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold">{c.fullName}</h2>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-muted text-sm">Customer ID: {c.id}</p>
              <Link
                href={`/customers/${c.id}`}
                className="text-brand-600 text-sm font-medium hover:underline"
              >
                Open full profile →
              </Link>
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 hover:bg-zinc-100"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="text-muted mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="size-3.5" />
              {c.mobile}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Mail className="size-3.5" />
              {c.email || "Email missing"}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-3.5" />
              {c.address || "Address missing"}
            </span>
          </div>

          <div
            role="tablist"
            className="border-line mt-4 flex gap-5 overflow-x-auto border-b text-sm"
          >
            {tabs.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  "-mb-px border-b-2 pb-2.5 font-medium whitespace-nowrap",
                  tab === t
                    ? "border-brand-500 text-ink"
                    : "text-muted hover:text-foreground border-transparent",
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === "Overview" && (
            <div className="border-line mt-5 flex gap-4 rounded-2xl border p-4">
              <CarImage
                make={c.vehicle.make}
                model={c.vehicle.model}
                seed={c.vehicle.vin}
                color={c.vehicle.color}
                className="h-24 w-36 shrink-0 rounded-xl"
              />
              <dl className="min-w-0 flex-1 text-xs">
                <div className="flex items-start justify-between">
                  <dt className="sr-only">Vehicle</dt>
                  <dd className="text-sm font-bold">
                    {c.vehicle.year} {c.vehicle.make} {c.vehicle.model} {c.vehicle.trim}
                  </dd>
                  <Pencil className="text-muted size-3.5" aria-label="Edit vehicle" />
                </div>
                {[
                  ["VIN", c.vehicle.vin],
                  ["Purchase Date", c.vehicle.purchaseDate],
                  ["Delivery Date", c.vehicle.deliveryDate],
                  ["Odometer", `${c.vehicle.odometerKm.toLocaleString()} km`],
                ].map(([k, v]) => (
                  <div key={k} className="mt-1 flex gap-2">
                    <dt className="text-muted w-24 shrink-0">{k}:</dt>
                    <dd className="truncate">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {show("Packages") && (
            <>
              <SectionHead
                title={`Protection Packages (${c.packages.length})`}
                action="Add Package"
                icon={Plus}
              />
              <ul className="border-line divide-line divide-y rounded-2xl border">
                {c.packages.map((p) => (
                  <li key={p.id} className="flex items-center gap-3 p-3">
                    <span className="bg-brand-50 text-brand-600 flex size-9 items-center justify-center rounded-full">
                      <ShieldCheck className="size-5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-muted text-xs">
                        {p.contractNumber} · Expires {p.expires}
                      </p>
                    </div>
                    <Badge>{p.active ? "Active" : "Expired"}</Badge>
                    <ChevronRight className="text-muted size-4" />
                  </li>
                ))}
                {c.packages.length === 0 && (
                  <li className="text-muted p-4 text-center text-sm">
                    No packages attached.
                  </li>
                )}
              </ul>
            </>
          )}

          {show("Rewards") && (
            <>
              <SectionHead title="Rewards & Wallet" />
              <div className="border-line flex items-center rounded-2xl border p-4">
                <span className="bg-brand-50 text-brand-600 mr-3 flex size-10 items-center justify-center rounded-full">
                  <Wallet className="size-5" strokeWidth={1.75} />
                </span>
                <div className="flex-1">
                  <p className="text-lg font-bold">
                    {c.rewardPoints.toLocaleString()} pts
                  </p>
                  <p className="text-muted text-xs">
                    ≈ {formatMoney(Math.round(c.rewardPoints * 1.0))} balance
                  </p>
                </div>
                <div className="border-line border-l pl-4 text-right">
                  <p className="text-lg font-bold">{formatMoney(c.serviceCreditCents)}</p>
                  <p className="text-muted text-xs">Service Credit</p>
                </div>
              </div>
            </>
          )}

          {show("Documents") && (
            <>
              <SectionHead
                title={`Documents (${c.documents.length})`}
                action="Upload"
                icon={Upload}
              />
              <ul className="border-line divide-line divide-y rounded-2xl border">
                {c.documents.map((d) => (
                  <li key={d.id} className="flex items-center gap-3 p-3">
                    <FileText className="size-5 text-zinc-500" strokeWidth={1.5} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold">{d.name}</p>
                      <p className="text-muted text-xs">Uploaded {d.uploaded}</p>
                    </div>
                    <button
                      aria-label={`Download ${d.name}`}
                      className="rounded-full p-1.5 hover:bg-zinc-100"
                    >
                      <Download className="size-4" />
                    </button>
                  </li>
                ))}
                {c.documents.length === 0 && (
                  <li className="text-muted p-4 text-center text-sm">
                    No documents uploaded.
                  </li>
                )}
              </ul>
            </>
          )}

          {tab === "Activity" && (
            <p className="text-muted mt-8 text-center text-sm">
              Activity history will appear here.
            </p>
          )}
        </div>

        <div className="border-line mt-auto border-t p-4">
          {!canInvite && (
            <p className="mb-2 text-xs text-amber-700">
              Complete the profile before inviting
              {missing.length ? ` — missing ${missing.join(", ")}` : ""}.
            </p>
          )}
          <div className="flex gap-3">
            <Button variant="dark" className="flex-1" disabled={!canInvite}>
              <Send className="size-4" />
              {c.status === "invitation_sent"
                ? "Resend Invitation"
                : "Send App Invitation"}
            </Button>
            <Button>
              <Pencil className="size-4" /> Edit
            </Button>
            <Button aria-label="More actions">
              <MoreHorizontal className="size-4" />
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
