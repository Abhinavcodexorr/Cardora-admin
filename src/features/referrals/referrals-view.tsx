"use client";

import { ArrowLeft, ArrowRight, Gift, Phone } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { referrals as seed, stageLabels, stages, type Referral } from "./data";

export function ReferralsView() {
  const [items, setItems] = useState<Referral[]>(seed);
  const [toast, show] = useToast();

  const move = (id: string, dir: 1 | -1) =>
    setItems((l) =>
      l.map((r) => {
        if (r.id !== id) return r;
        const next = stages[stages.indexOf(r.stage) + dir];
        if (next === "converted")
          show(`${r.referredBy} earns 500 points for this conversion (demo)`);
        return { ...r, stage: next };
      }),
    );

  return (
    <>
      <p className="bg-brand-50 text-brand-700 flex items-center gap-2 rounded-xl px-4 py-3 text-sm">
        <Gift className="size-4" /> Referrers earn <b>500 points</b> when a lead is marked
        Converted. Leads are submitted from the Cardora App.
      </p>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stages.map((st) => {
          const col = items.filter((r) => r.stage === st);
          return (
            <section
              key={st}
              aria-label={stageLabels[st]}
              className="rounded-2xl bg-zinc-100/70 p-3"
            >
              <h2 className="flex items-center justify-between px-2 py-1 text-sm font-semibold">
                {stageLabels[st]}{" "}
                <span className="text-muted bg-surface rounded-full px-2 text-xs">
                  {col.length}
                </span>
              </h2>
              <ul className="mt-2 space-y-3">
                {col.map((r) => (
                  <li key={r.id}>
                    <Card className="p-4">
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-muted mt-0.5 flex items-center gap-1 text-xs">
                        <Phone className="size-3" /> {r.phone}
                      </p>
                      <p className="mt-2 text-sm">{r.interest}</p>
                      <p className="text-muted mt-1 text-xs">
                        Referred by <b className="text-ink">{r.referredBy}</b> · {r.date}
                      </p>
                      <div className="mt-3 flex justify-between">
                        <button
                          aria-label="Move back"
                          disabled={st === "new"}
                          onClick={() => move(r.id, -1)}
                          className={cn(
                            "rounded-lg p-1.5 hover:bg-zinc-100",
                            st === "new" && "invisible",
                          )}
                        >
                          <ArrowLeft className="size-4" />
                        </button>
                        <button
                          aria-label="Move forward"
                          disabled={st === "converted"}
                          onClick={() => move(r.id, 1)}
                          className={cn(
                            "text-brand-600 hover:bg-brand-50 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
                            st === "converted" && "invisible",
                          )}
                        >
                          {st === "qualified" ? "Mark converted" : "Advance"}{" "}
                          <ArrowRight className="size-3.5" />
                        </button>
                      </div>
                    </Card>
                  </li>
                ))}
                {col.length === 0 && (
                  <li className="text-muted py-6 text-center text-xs">No leads</li>
                )}
              </ul>
            </section>
          );
        })}
      </div>
      {toast}
    </>
  );
}
