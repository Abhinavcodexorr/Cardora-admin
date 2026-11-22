"use client";

import { Download } from "lucide-react";
import { useState } from "react";
import { AreaChart, BarChart, HBars } from "@/components/charts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Segmented } from "@/components/ui/tab-bar";

const ranges = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "12m", label: "12 months" },
];

type Data = {
  activations: { label: string; value: number }[];
  points: { label: string; earned: number; redeemed: number }[];
  kpis: { label: string; value: string }[];
};

const data: Record<string, Data> = {
  "7d": {
    activations: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label, i) => ({
      label,
      value: [12, 18, 15, 22, 27, 19, 24][i],
    })),
    points: ["Mon", "Tue", "Wed", "Thu", "Fri"].map((label, i) => ({
      label,
      earned: [5200, 6100, 4800, 7300, 8100][i],
      redeemed: [1800, 2400, 1500, 3100, 2900][i],
    })),
    kpis: [
      { label: "New activations", value: "137" },
      { label: "Activation rate", value: "74%" },
      { label: "Points earned", value: "31.5k" },
      { label: "Requests handled", value: "42" },
    ],
  },
  "30d": {
    activations: ["W1", "W2", "W3", "W4"].map((label, i) => ({
      label,
      value: [96, 118, 131, 152][i],
    })),
    points: ["W1", "W2", "W3", "W4"].map((label, i) => ({
      label,
      earned: [24000, 28500, 31200, 36800][i],
      redeemed: [9000, 11200, 10400, 14600][i],
    })),
    kpis: [
      { label: "New activations", value: "497" },
      { label: "Activation rate", value: "78%" },
      { label: "Points earned", value: "120.5k" },
      { label: "Requests handled", value: "186" },
    ],
  },
  "90d": {
    activations: ["Sep", "Oct", "Nov"].map((label, i) => ({
      label,
      value: [388, 441, 497][i],
    })),
    points: ["Sep", "Oct", "Nov"].map((label, i) => ({
      label,
      earned: [98000, 109000, 120500][i],
      redeemed: [34000, 41000, 45800][i],
    })),
    kpis: [
      { label: "New activations", value: "1,326" },
      { label: "Activation rate", value: "76%" },
      { label: "Points earned", value: "327.5k" },
      { label: "Requests handled", value: "540" },
    ],
  },
  "12m": {
    activations: ["Dec", "Feb", "Apr", "Jun", "Aug", "Oct"].map((label, i) => ({
      label,
      value: [210, 260, 340, 380, 430, 497][i],
    })),
    points: ["Q1", "Q2", "Q3", "Q4"].map((label, i) => ({
      label,
      earned: [210000, 265000, 318000, 327500][i],
      redeemed: [72000, 98000, 121000, 120800][i],
    })),
    kpis: [
      { label: "New activations", value: "4,812" },
      { label: "Activation rate", value: "72%" },
      { label: "Points earned", value: "1.12M" },
      { label: "Requests handled", value: "2,034" },
    ],
  },
};

export function ReportsView() {
  const [range, setRange] = useState("30d");
  const d = data[range];

  const exportCsv = () => {
    const rows = [
      ["period", "activations"],
      ...d.activations.map((a) => [a.label, String(a.value)]),
    ];
    const url = URL.createObjectURL(
      new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `cardora-activations-${range}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          label="Date range"
          options={ranges}
          value={range}
          onChange={setRange}
        />
        <Button onClick={exportCsv}>
          <Download className="size-4" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {d.kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <p className="text-3xl font-bold tracking-tight">{k.value}</p>
            <p className="text-muted mt-1 text-sm">{k.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-3 text-lg font-semibold">App activations</h2>
          <AreaChart key={range} id="rep" series={d.activations} />
        </Card>
        <Card className="p-6">
          <h2 className="mb-3 text-lg font-semibold">Points earned vs redeemed</h2>
          <BarChart
            data={d.points}
            keys={[
              { key: "earned", color: "#00af66", name: "Earned" },
              { key: "redeemed", color: "var(--color-ink)", name: "Redeemed" },
            ]}
          />
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Onboarding funnel</h2>
          <HBars
            rows={[
              { label: "Profiles created", value: 1248 },
              { label: "Ready to invite", value: 1102 },
              { label: "Invitation sent", value: 1040 },
              { label: "Activated", value: 974 },
              { label: "Delivery complete", value: 931 },
            ]}
          />
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Requests by type</h2>
          <HBars
            rows={[
              { label: "Service", value: 112, hint: "112 · 60%" },
              { label: "Appraisal", value: 46, hint: "46 · 25%" },
              { label: "Referral leads", value: 28, hint: "28 · 15%" },
            ]}
          />
        </Card>
      </div>
    </div>
  );
}
