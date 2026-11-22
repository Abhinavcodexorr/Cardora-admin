"use client";

import { CarImage } from "@/components/ui/car-image";
import {
  ArrowLeft,
  Download,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
  Upload,
  Wallet,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { InvitePanel } from "./invite-panel";
import { StatusBadge } from "./status-badge";
import { StatusStepper } from "./status-stepper";
import { formatMoney, type Customer, type CustomerStatus } from "./types";

export function CustomerProfile({ customer: c }: { customer: Customer }) {
  const [status, setStatus] = useState<CustomerStatus>(c.status);
  const complete = Boolean(c.email && c.address && c.mobile);
  const ready = complete && status !== "profile_incomplete";
  const v = c.vehicle;

  return (
    <div className="space-y-6">
      <Link
        href="/customers"
        className="text-muted hover:text-foreground inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" /> All customers
      </Link>

      <Card className="p-6">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar name={c.fullName} className="size-16 text-xl" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{c.fullName}</h1>
              <StatusBadge status={status} />
            </div>
            <p className="text-muted mt-1 text-sm">Customer ID: {c.id}</p>
            <div className="text-muted mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <span className="inline-flex items-center gap-1.5">
                <Phone className="size-4" />
                {c.mobile}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="size-4" />
                {c.email || "Email missing"}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" />
                {c.address || "Address missing"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {status === "activated" && (
              <Button variant="primary" onClick={() => setStatus("delivery_complete")}>
                Mark Delivery Complete
              </Button>
            )}
            <Button>
              <Pencil className="size-4" /> Edit
            </Button>
          </div>
        </div>
        <div className="mt-8">
          <StatusStepper status={status} />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Purchased vehicle</h2>
            <div className="flex flex-wrap gap-5">
              <CarImage
                make={v.make}
                model={v.model}
                seed={v.vin}
                color={v.color}
                className="h-36 w-56 rounded-2xl"
              />
              <dl className="grid flex-1 grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {[
                  ["Vehicle", `${v.year} ${v.make} ${v.model} ${v.trim}`],
                  ["VIN", v.vin],
                  ["Stock #", v.stockNumber ?? "—"],
                  ["Odometer at delivery", `${v.odometerKm.toLocaleString()} km`],
                  ["Purchase date", v.purchaseDate],
                  ["Delivery date", v.deliveryDate],
                  ["Delivery location", v.deliveryLocation],
                ].map(([k, val]) => (
                  <div key={k}>
                    <dt className="text-muted text-xs">{k}</dt>
                    <dd className="font-medium break-all">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Protection packages ({c.packages.length})
              </h2>
              <button className="text-brand-600 inline-flex items-center gap-1 text-sm font-medium hover:underline">
                <Plus className="size-4" /> Add Package
              </button>
            </div>
            <ul className="divide-line divide-y">
              {c.packages.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-3">
                  <span className="bg-brand-50 text-brand-600 flex size-10 items-center justify-center rounded-full">
                    <ShieldCheck className="size-5" strokeWidth={1.75} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-muted text-xs">
                      {p.contractNumber} · Expires {p.expires}
                    </p>
                  </div>
                  <Badge>{p.active ? "Active" : "Expired"}</Badge>
                </li>
              ))}
              {c.packages.length === 0 && (
                <li className="text-muted py-6 text-center text-sm">
                  No packages attached yet.
                </li>
              )}
            </ul>
          </Card>

          <Card className="p-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Documents ({c.documents.length})</h2>
              <button className="text-brand-600 inline-flex items-center gap-1 text-sm font-medium hover:underline">
                <Upload className="size-4" /> Upload
              </button>
            </div>
            <ul className="divide-line divide-y">
              {c.documents.map((d) => (
                <li key={d.id} className="flex items-center gap-3 py-3">
                  <FileText className="size-5 text-zinc-500" strokeWidth={1.5} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{d.name}</p>
                    <p className="text-muted text-xs">Uploaded {d.uploaded}</p>
                  </div>
                  <button
                    aria-label={`Download ${d.name}`}
                    className="rounded-full p-2 hover:bg-zinc-100"
                  >
                    <Download className="size-4" />
                  </button>
                </li>
              ))}
              {c.documents.length === 0 && (
                <li className="text-muted py-6 text-center text-sm">
                  No documents uploaded yet.
                </li>
              )}
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <InvitePanel
              customerId={c.id}
              mobile={c.mobile}
              email={c.email}
              ready={ready}
              sent={
                status === "invitation_sent" ||
                status === "activated" ||
                status === "delivery_complete"
              }
              onSent={() =>
                setStatus((s) => (s === "ready_to_invite" ? "invitation_sent" : s))
              }
            />
          </Card>
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Rewards &amp; Wallet</h2>
            <div className="flex items-center gap-3">
              <span className="bg-brand-50 text-brand-600 flex size-11 items-center justify-center rounded-full">
                <Wallet className="size-5" strokeWidth={1.75} />
              </span>
              <div className="flex-1">
                <p className="text-xl font-bold">{c.rewardPoints.toLocaleString()} pts</p>
                <p className="text-muted text-xs">Synced from the Cardora App</p>
              </div>
            </div>
            <div className="border-line mt-4 flex items-center justify-between border-t pt-4">
              <span className="text-muted text-sm">Service credit</span>
              <span className="text-lg font-bold">
                {formatMoney(c.serviceCreditCents)}
              </span>
            </div>
          </Card>
          <Link href="/customers" className={buttonStyles("outline", "w-full")}>
            Back to customers
          </Link>
        </div>
      </div>
    </div>
  );
}
