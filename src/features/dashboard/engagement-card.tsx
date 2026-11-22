"use client";

import { useState } from "react";
import { AreaChart, type Point } from "@/components/charts";
import { Card } from "@/components/ui/card";
import { Segmented } from "@/components/ui/tab-bar";

export function EngagementCard({
  data,
  rate,
}: {
  data: Record<string, Point[]>;
  rate: number;
}) {
  const [range, setRange] = useState("30d");
  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">App engagement</h2>
          <p className="text-muted text-sm">Share of customers who activated the app</p>
        </div>
        <div className="flex items-center gap-4">
          <Segmented
            label="Range"
            value={range}
            onChange={setRange}
            options={[
              { id: "7d", label: "7D" },
              { id: "30d", label: "30D" },
              { id: "90d", label: "90D" },
            ]}
          />
          <div className="text-right">
            <p className="text-3xl leading-none font-bold">{rate}%</p>
            <p className="text-muted text-xs">Activation rate</p>
          </div>
        </div>
      </div>
      <div className="mt-6">
        <AreaChart key={range} id="eng" series={data[range]} unit="%" />
      </div>
    </Card>
  );
}
