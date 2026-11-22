"use client";

import { ArrowLeft, CheckCircle2, Plus, Sparkles, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { z } from "zod";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { InvitePanel } from "./invite-panel";
import { StatusBadge } from "./status-badge";
import { StatusStepper } from "./status-stepper";
import type { CustomerStatus } from "./types";

const packageOptions = [
  "Extended Warranty",
  "Roadside Assistance",
  "Tire & Rim Protection",
  "GAP Coverage",
  "Paint & Fabric Protection",
];

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter the customer's full name"),
  mobile: z
    .string()
    .trim()
    .regex(/^[\d\s()+-]{10,}$/, "Enter a valid mobile number"),
  email: z.union([z.literal(""), z.email("Enter a valid email")]),
  address: z.string().trim(),
  year: z.coerce
    .number()
    .int()
    .min(1990, "Enter a valid year")
    .max(2100, "Enter a valid year"),
  make: z.string().trim().min(1, "Required"),
  model: z.string().trim().min(1, "Required"),
  trim: z.string().trim(),
  vin: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, "VIN must be 17 characters (no I, O or Q)"),
  odometer: z
    .string()
    .min(1, "Enter the odometer reading")
    .refine((s) => Number(s) >= 0, "Enter the odometer reading"),
  purchaseDate: z.string().min(1, "Required"),
  deliveryDate: z.string().min(1, "Required"),
  deliveryLocation: z.string().trim().min(1, "Required"),
  credit: z.coerce.number().min(0, "Cannot be negative").max(10000),
});

type Values = Record<keyof z.input<typeof schema>, string>;
type Errors = Partial<Record<keyof Values, string>>;

const initial: Values = {
  fullName: "",
  mobile: "",
  email: "",
  address: "",
  year: "",
  make: "",
  model: "",
  trim: "",
  vin: "",
  odometer: "",
  purchaseDate: "",
  deliveryDate: "",
  deliveryLocation: "",
  credit: "100",
};

type Pkg = { key: number; name: string; contract: string; expires: string };

// Demo-only VIN lookup (static table; no network).
const wmi: Record<string, [string, string]> = {
  "5UX": ["BMW", "X5"],
  WA1: ["Audi", "Q5"],
  "2HK": ["Honda", "CR-V"],
  "2T3": ["Toyota", "RAV4"],
  KM8: ["Hyundai", "Tucson"],
  JM3: ["Mazda", "CX-5"],
};
const yearCode: Record<string, number> = { N: 2022, P: 2023, R: 2024, S: 2025, T: 2026 };

const inputCls =
  "border-line focus:border-brand-500 focus:ring-brand-100 h-10 w-full rounded-xl border bg-surface px-3 text-sm outline-none focus:ring-4 aria-[invalid=true]:border-red-400";

function Field({
  label,
  error,
  hint,
  className,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children(id)}
      {error ? (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p className="text-muted mt-1 text-xs">{hint}</p>
      ) : null}
    </div>
  );
}

function Section({
  n,
  title,
  desc,
  children,
}: {
  n: number;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="bg-brand-500 flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
          {n}
        </span>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-muted text-sm">{desc}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}

export function AddCustomerForm() {
  const [v, setV] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [pkgs, setPkgs] = useState<Pkg[]>([]);
  const [files, setFiles] = useState<string[]>([]);
  const [vinNote, setVinNote] = useState("");
  const [saved, setSaved] = useState<{ id: string; status: CustomerStatus } | null>(null);
  const [sent, setSent] = useState(false);

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setV((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: undefined }));
  };
  const props = (k: keyof Values, id: string) => ({
    id,
    value: v[k],
    onChange: set(k),
    className: inputCls,
    "aria-invalid": Boolean(errors[k]) || undefined,
  });

  const decodeVin = () => {
    const vin = v.vin.trim().toUpperCase();
    const hit = wmi[vin.slice(0, 3)];
    if (vin.length !== 17 || !hit) {
      setVinNote("No match found in the demo VIN table. Enter the details manually.");
      return;
    }
    setV((p) => ({
      ...p,
      make: hit[0],
      model: hit[1],
      year: String(yearCode[vin[9]] ?? p.year),
    }));
    setVinNote("Decoded (demo data). Please confirm the details below.");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = schema.safeParse(v);
    if (!res.success) {
      const errs: Errors = {};
      for (const issue of res.error.issues) {
        const k = issue.path[0] as keyof Values;
        errs[k] ??= issue.message;
      }
      setErrors(errs);
      document
        .getElementById("add-customer-form")
        ?.querySelector<HTMLElement>("[aria-invalid=true]")
        ?.focus();
      return;
    }
    const complete = Boolean(res.data.email && res.data.address);
    // Static demo: nothing is persisted or sent anywhere.
    setSaved({
      id: "CDR-10483",
      status: complete ? "ready_to_invite" : "profile_incomplete",
    });
  };

  if (saved) {
    const ready = saved.status !== "profile_incomplete";
    const status: CustomerStatus = sent ? "invitation_sent" : saved.status;
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Card className="p-8 text-center">
          <CheckCircle2 className="text-brand-500 mx-auto size-12" />
          <h1 className="mt-3 text-2xl font-bold">Customer profile created</h1>
          <p className="text-muted mt-1 text-sm">
            {v.fullName} · {saved.id} · <StatusBadge status={status} />
          </p>
          <p className="text-muted mx-auto mt-3 max-w-md text-xs">
            Static preview: this record is not stored anywhere and will not appear in the
            list.
          </p>
          <div className="mt-8">
            <StatusStepper status={status} />
          </div>
        </Card>
        <Card className="p-6">
          <InvitePanel
            customerId={saved.id}
            mobile={v.mobile}
            email={v.email}
            ready={ready}
            sent={sent}
            onSent={() => setSent(true)}
          />
        </Card>
        <div className="flex justify-center gap-3">
          <Link href="/customers" className={buttonStyles("outline")}>
            Back to customers
          </Link>
          <Button
            variant="primary"
            onClick={() => {
              setV(initial);
              setPkgs([]);
              setFiles([]);
              setSaved(null);
              setSent(false);
            }}
          >
            Add another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      id="add-customer-form"
      onSubmit={submit}
      noValidate
      className="mx-auto max-w-4xl space-y-6"
    >
      <div>
        <Link
          href="/customers"
          className="text-muted hover:text-foreground inline-flex items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" /> All customers
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Add customer</h1>
        <p className="text-muted mt-1 text-sm">
          Create the profile, enter the purchased vehicle, then invite the customer to the
          app.
        </p>
      </div>

      <Section
        n={1}
        title="Customer details"
        desc="Contact details used for the app invitation and one-time code."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name *" error={errors.fullName} className="sm:col-span-2">
            {(id) => <input {...props("fullName", id)} autoComplete="off" />}
          </Field>
          <Field label="Mobile *" error={errors.mobile}>
            {(id) => (
              <input {...props("mobile", id)} type="tel" placeholder="(416) 555-0100" />
            )}
          </Field>
          <Field
            label="Email"
            error={errors.email}
            hint="Needed before an invitation can be sent."
          >
            {(id) => <input {...props("email", id)} type="email" />}
          </Field>
          <Field
            label="Address"
            className="sm:col-span-2"
            hint="Needed before an invitation can be sent."
          >
            {(id) => <input {...props("address", id)} autoComplete="off" />}
          </Field>
          <div className="text-muted text-xs sm:col-span-2">
            Customer ID is generated automatically on save.
          </div>
        </div>
      </Section>

      <Section
        n={2}
        title="Purchased vehicle"
        desc="Entered manually. VIN decoding is optional to reduce errors."
      >
        <div className="grid gap-4 sm:grid-cols-6">
          <Field label="VIN *" error={errors.vin} className="sm:col-span-4">
            {(id) => (
              <input
                {...props("vin", id)}
                maxLength={17}
                className={cn(inputCls, "font-mono uppercase")}
              />
            )}
          </Field>
          <div className="flex items-end sm:col-span-2">
            <Button className="w-full" onClick={decodeVin}>
              <Sparkles className="size-4" /> Decode VIN
            </Button>
          </div>
          {vinNote && (
            <p role="status" className="text-brand-700 text-xs sm:col-span-6">
              {vinNote}
            </p>
          )}
          <Field label="Year *" error={errors.year} className="sm:col-span-2">
            {(id) => <input {...props("year", id)} inputMode="numeric" />}
          </Field>
          <Field label="Make *" error={errors.make} className="sm:col-span-2">
            {(id) => <input {...props("make", id)} />}
          </Field>
          <Field label="Model *" error={errors.model} className="sm:col-span-2">
            {(id) => <input {...props("model", id)} />}
          </Field>
          <Field label="Trim" className="sm:col-span-2">
            {(id) => <input {...props("trim", id)} />}
          </Field>
          <Field
            label="Odometer at delivery (km) *"
            error={errors.odometer}
            className="sm:col-span-2"
          >
            {(id) => <input {...props("odometer", id)} inputMode="numeric" />}
          </Field>
          <Field
            label="Delivery location *"
            error={errors.deliveryLocation}
            className="sm:col-span-2"
          >
            {(id) => <input {...props("deliveryLocation", id)} />}
          </Field>
          <Field
            label="Purchase date *"
            error={errors.purchaseDate}
            className="sm:col-span-3"
          >
            {(id) => <input {...props("purchaseDate", id)} type="date" />}
          </Field>
          <Field
            label="Delivery date *"
            error={errors.deliveryDate}
            className="sm:col-span-3"
          >
            {(id) => <input {...props("deliveryDate", id)} type="date" />}
          </Field>
        </div>
      </Section>

      <Section
        n={3}
        title="Protection products"
        desc="Attach any number of purchased products."
      >
        <ul className="space-y-3">
          {pkgs.map((p) => (
            <li
              key={p.key}
              className="grid items-end gap-3 sm:grid-cols-[1.2fr_1fr_1fr_auto]"
            >
              <select
                aria-label="Product"
                value={p.name}
                onChange={(e) =>
                  setPkgs((l) =>
                    l.map((x) => (x.key === p.key ? { ...x, name: e.target.value } : x)),
                  )
                }
                className={inputCls}
              >
                {packageOptions.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <input
                aria-label="Contract number"
                placeholder="Contract #"
                value={p.contract}
                onChange={(e) =>
                  setPkgs((l) =>
                    l.map((x) =>
                      x.key === p.key ? { ...x, contract: e.target.value } : x,
                    ),
                  )
                }
                className={inputCls}
              />
              <input
                aria-label="Expiry date"
                type="date"
                value={p.expires}
                onChange={(e) =>
                  setPkgs((l) =>
                    l.map((x) =>
                      x.key === p.key ? { ...x, expires: e.target.value } : x,
                    ),
                  )
                }
                className={inputCls}
              />
              <button
                type="button"
                aria-label="Remove product"
                onClick={() => setPkgs((l) => l.filter((x) => x.key !== p.key))}
                className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
        <Button
          className="mt-3"
          onClick={() =>
            setPkgs((l) => [
              ...l,
              { key: Date.now(), name: packageOptions[0], contract: "", expires: "" },
            ])
          }
        >
          <Plus className="size-4" /> Add product
        </Button>
      </Section>

      <Section
        n={4}
        title="Documents"
        desc="Ownership, insurance and sales documents (staff upload)."
      >
        <label className="border-line hover:border-brand-500 hover:bg-brand-50/40 flex cursor-pointer flex-col items-center gap-1 rounded-2xl border-2 border-dashed p-6 text-center text-sm">
          <Upload className="text-brand-600 size-6" />
          <span className="font-medium">Choose files</span>
          <span className="text-muted text-xs">
            PDF, JPG or PNG. Files stay in your browser in this preview.
          </span>
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            onChange={(e) =>
              setFiles((f) => [
                ...f,
                ...Array.from(e.target.files ?? []).map((x) => x.name),
              ])
            }
          />
        </label>
        {files.length > 0 && (
          <ul className="divide-line mt-3 divide-y text-sm">
            {files.map((f, i) => (
              <li key={`${f}-${i}`} className="flex items-center justify-between py-2">
                <span className="truncate">{f}</span>
                <button
                  type="button"
                  aria-label={`Remove ${f}`}
                  onClick={() => setFiles((l) => l.filter((_, j) => j !== i))}
                  className="rounded-full p-1.5 text-zinc-500 hover:bg-zinc-100"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section
        n={5}
        title="Initial service credit"
        desc="Default is $100 and can be changed."
      >
        <Field label="Credit amount (CAD)" error={errors.credit} className="max-w-xs">
          {(id) => <input {...props("credit", id)} inputMode="decimal" />}
        </Field>
      </Section>

      <div className="border-line bg-surface/90 sticky bottom-0 -mx-2 flex items-center justify-end gap-3 border-t px-2 py-4 backdrop-blur">
        <Link href="/customers" className={buttonStyles("outline")}>
          Cancel
        </Link>
        <Button type="submit" variant="primary">
          Create customer
        </Button>
      </div>
    </form>
  );
}
