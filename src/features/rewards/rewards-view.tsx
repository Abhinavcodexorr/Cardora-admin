"use client";

import { Coins, PiggyBank, Plus, Receipt, Wallet } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DataView } from "@/components/ui/data-view";
import { uniqueOptions, type FilterDef, type SortDef } from "@/components/ui/filter-bar";
import { toTime } from "@/lib/dates";

import { Drawer } from "@/components/ui/drawer";
import { Field, inputCls } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { StatCard } from "@/features/dashboard/stat-card";
import { formatMoney, type Customer } from "@/features/customers/types";
import { rewardsSummary as s, transactions, type Tx, type TxType } from "./data";

const tone = {
  earned: "green",
  redeemed: "blue",
  credit: "amber",
  adjustment: "gray",
} as const;
const names: Record<TxType, string> = {
  earned: "Earned",
  redeemed: "Redeemed",
  credit: "Service credit",
  adjustment: "Adjustment",
};
const n = new Intl.NumberFormat("en-CA");

function makeFilters(rows: Tx[]): { filters: FilterDef<Tx>[]; sorts: SortDef<Tx>[] } {
  return {
    filters: [
      {
        id: "cust",
        label: "Customer",
        allLabel: "All customers",
        options: uniqueOptions(rows, (r) => r.customer),
        test: (r, v) => r.customer === v,
      },
      {
        id: "dir",
        label: "Direction",
        allLabel: "Any movement",
        options: [
          { value: "pin", label: "Points added" },
          { value: "pout", label: "Points deducted" },
          { value: "cin", label: "Credit added" },
          { value: "cout", label: "Credit used" },
        ],
        test: (r, v) =>
          v === "pin"
            ? r.points > 0
            : v === "pout"
              ? r.points < 0
              : v === "cin"
                ? r.creditCents > 0
                : r.creditCents < 0,
      },
    ],
    sorts: [
      {
        id: "new",
        label: "Newest first",
        compare: (a, b) => toTime(b.date) - toTime(a.date),
      },
      { id: "pts", label: "Points (high → low)", compare: (a, b) => b.points - a.points },
      {
        id: "cred",
        label: "Credit (high → low)",
        compare: (a, b) => b.creditCents - a.creditCents,
      },
      {
        id: "cust",
        label: "Customer (A–Z)",
        compare: (a, b) => a.customer.localeCompare(b.customer),
      },
    ],
  };
}

export function RewardsView({ customers }: { customers: Customer[] }) {
  const [rows, setRows] = useState<Tx[]>(transactions);
  const { filters, sorts } = useMemo(() => makeFilters(rows), [rows]);
  const [adjust, setAdjust] = useState(false);
  const [toast, show] = useToast();
  const [rules, setRules] = useState({
    perDollar: "1",
    pointValue: "1",
    credit: "100",
    expiry: "24",
  });
  const [adj, setAdj] = useState({
    customer: customers[0].id,
    kind: "points",
    amount: "",
    reason: "",
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          icon={Coins}
          value={n.format(s.pointsOutstanding)}
          label="Points outstanding"
        />
        <StatCard
          icon={PiggyBank}
          value={formatMoney(s.liabilityCents)}
          label="Rewards liability"
        />
        <StatCard
          icon={Wallet}
          value={formatMoney(s.creditsIssuedCents)}
          label="Service credit issued"
        />
        <StatCard
          icon={Receipt}
          value={formatMoney(s.creditsRedeemedCents)}
          label="Service credit redeemed"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DataView
            title="Wallet activity"
            rows={rows}
            rowKey={(r) => r.id}
            searchText={(r) => `${r.customer} ${r.description}`}
            searchPlaceholder="Search activity..."
            filters={filters}
            sorts={sorts}
            toolbar={
              <Button variant="primary" onClick={() => setAdjust(true)}>
                <Plus className="size-4" /> Adjust balance
              </Button>
            }
            tabs={[
              { id: "all", label: "All" },
              { id: "earned", label: "Earned", filter: (r) => r.type === "earned" },
              { id: "redeemed", label: "Redeemed", filter: (r) => r.type === "redeemed" },
              { id: "credit", label: "Credits", filter: (r) => r.type === "credit" },
              { id: "adj", label: "Adjustments", filter: (r) => r.type === "adjustment" },
            ]}
            columns={[
              {
                header: "Customer",
                cell: (r) => (
                  <Link
                    href={`/customers/${r.customerId}`}
                    className="font-semibold hover:underline"
                  >
                    {r.customer}
                  </Link>
                ),
              },
              {
                header: "Activity",
                cell: (r) => (
                  <>
                    <Badge tone={tone[r.type]}>{names[r.type]}</Badge>
                    <span className="text-muted ml-2 text-xs">{r.description}</span>
                  </>
                ),
              },
              {
                header: "Points",
                cell: (r) =>
                  r.points ? (
                    <b className={r.points > 0 ? "text-brand-600" : ""}>
                      {r.points > 0 ? "+" : ""}
                      {r.points}
                    </b>
                  ) : (
                    "—"
                  ),
              },
              {
                header: "Credit",
                cell: (r) =>
                  r.creditCents ? (
                    <b>
                      {r.creditCents > 0 ? "+" : ""}
                      {formatMoney(r.creditCents)}
                    </b>
                  ) : (
                    "—"
                  ),
              },
              {
                header: "Date",
                cell: (r) => <span className="text-muted">{r.date}</span>,
              },
            ]}
          />
        </div>

        <Card className="h-fit p-6">
          <h2 className="text-lg font-semibold">Reward rules</h2>
          <p className="text-muted mt-1 text-sm">
            Defaults applied to new customers and future activity.
          </p>
          <form
            className="mt-4 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              show("Rules saved (preview only)");
            }}
          >
            <Field label="Points earned per $1 spent">
              {(id) => (
                <input
                  id={id}
                  className={inputCls}
                  inputMode="decimal"
                  value={rules.perDollar}
                  onChange={(e) => setRules({ ...rules, perDollar: e.target.value })}
                />
              )}
            </Field>
            <Field label="Point value (cents)" hint="1 point = 1¢ by default.">
              {(id) => (
                <input
                  id={id}
                  className={inputCls}
                  inputMode="decimal"
                  value={rules.pointValue}
                  onChange={(e) => setRules({ ...rules, pointValue: e.target.value })}
                />
              )}
            </Field>
            <Field
              label="Initial service credit ($)"
              hint="Assigned when a customer is created."
            >
              {(id) => (
                <input
                  id={id}
                  className={inputCls}
                  inputMode="decimal"
                  value={rules.credit}
                  onChange={(e) => setRules({ ...rules, credit: e.target.value })}
                />
              )}
            </Field>
            <Field label="Points expire after (months)">
              {(id) => (
                <input
                  id={id}
                  className={inputCls}
                  inputMode="numeric"
                  value={rules.expiry}
                  onChange={(e) => setRules({ ...rules, expiry: e.target.value })}
                />
              )}
            </Field>
            <Button type="submit" variant="primary" className="w-full">
              Save rules
            </Button>
          </form>
        </Card>
      </div>

      {adjust && (
        <Drawer
          title="Adjust balance"
          subtitle="Add or remove points or service credit"
          onClose={() => setAdjust(false)}
          footer={
            <div className="flex justify-end gap-2">
              <Button onClick={() => setAdjust(false)}>Cancel</Button>
              <Button
                variant="primary"
                disabled={
                  !adj.amount || !adj.reason.trim() || Number.isNaN(Number(adj.amount))
                }
                onClick={() => {
                  const c = customers.find((x) => x.id === adj.customer)!;
                  const amt = Number(adj.amount);
                  setRows((l) => [
                    {
                      id: `a${l.length}`,
                      customer: c.fullName,
                      customerId: c.id,
                      type: "adjustment",
                      description: adj.reason.trim(),
                      points: adj.kind === "points" ? amt : 0,
                      creditCents: adj.kind === "credit" ? Math.round(amt * 100) : 0,
                      date: "Nov 22, 2026",
                    },
                    ...l,
                  ]);
                  setAdjust(false);
                  setAdj({ ...adj, amount: "", reason: "" });
                  show("Adjustment recorded (preview only)");
                }}
              >
                Apply adjustment
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Field label="Customer">
              {(id) => (
                <select
                  id={id}
                  className={inputCls}
                  value={adj.customer}
                  onChange={(e) => setAdj({ ...adj, customer: e.target.value })}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} ({c.id})
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <Field label="Adjust">
              {(id) => (
                <select
                  id={id}
                  className={inputCls}
                  value={adj.kind}
                  onChange={(e) => setAdj({ ...adj, kind: e.target.value })}
                >
                  <option value="points">Points</option>
                  <option value="credit">Service credit ($)</option>
                </select>
              )}
            </Field>
            <Field label="Amount" hint="Use a negative number to deduct.">
              {(id) => (
                <input
                  id={id}
                  className={inputCls}
                  inputMode="decimal"
                  value={adj.amount}
                  onChange={(e) => setAdj({ ...adj, amount: e.target.value })}
                />
              )}
            </Field>
            <Field label="Reason (required)">
              {(id) => (
                <input
                  id={id}
                  className={inputCls}
                  value={adj.reason}
                  onChange={(e) => setAdj({ ...adj, reason: e.target.value })}
                />
              )}
            </Field>
          </div>
        </Drawer>
      )}
      {toast}
    </div>
  );
}
