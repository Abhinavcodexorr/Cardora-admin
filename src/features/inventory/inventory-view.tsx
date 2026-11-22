"use client";

import { CarImage } from "@/components/ui/car-image";
import { Lock, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { inputCls } from "@/components/ui/field";
import { formatMoney } from "@/features/customers/types";
import { listings } from "./data";

export function InventoryView() {
  const [q, setQ] = useState("");
  const [make, setMake] = useState("all");
  const [sort, setSort] = useState("new");
  const makes = [...new Set(listings.map((l) => l.make))];

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = listings.filter(
      (l) =>
        (make === "all" || l.make === make) &&
        (!s ||
          `${l.year} ${l.make} ${l.model} ${l.trim} ${l.stock}`
            .toLowerCase()
            .includes(s)),
    );
    if (sort === "low") list.sort((a, b) => a.priceCents - b.priceCents);
    if (sort === "high") list.sort((a, b) => b.priceCents - a.priceCents);
    return list;
  }, [q, make, sort]);

  return (
    <div className="space-y-6">
      <div className="bg-inverse flex flex-wrap items-center gap-3 rounded-2xl px-5 py-4 text-sm text-white">
        <Lock className="text-brand-400 size-4" />
        <span className="flex-1">
          <b>Read-only IMS feed.</b> Listings, photos and prices come from the dealership
          IMS and cannot be edited here.
        </span>
        <span className="inline-flex items-center gap-1.5 text-zinc-300">
          <RefreshCw className="size-3.5" /> Synced 4 min ago
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <Search className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <input
            aria-label="Search inventory"
            placeholder="Search make, model or stock #..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className={`${inputCls} w-72 pl-9`}
          />
        </div>
        <select
          aria-label="Make"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className={`${inputCls} w-40`}
        >
          <option value="all">All makes</option>
          {makes.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select
          aria-label="Sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={`${inputCls} w-48`}
        >
          <option value="new">Newest first</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
        <span className="text-muted ml-auto self-center text-sm">
          {rows.length} vehicles
        </span>
      </div>

      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map((l) => (
          <li key={l.id}>
            <Card className="overflow-hidden">
              <div className="relative">
                <CarImage
                  make={l.make}
                  model={l.model}
                  color={l.color}
                  seed={l.stock}
                  className="h-48 w-full"
                />
                {l.badge && <Badge className="absolute top-3 left-3">{l.badge}</Badge>}
              </div>
              <div className="p-5">
                <h3 className="font-semibold">
                  {l.year} {l.make} {l.model}
                </h3>
                <p className="text-muted text-sm">
                  {[l.trim, l.color].filter(Boolean).join(" · ")}
                </p>
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-2xl font-bold">{formatMoney(l.priceCents)}</p>
                  <p className="text-muted text-xs">
                    {l.km.toLocaleString()} km · #{l.stock}
                  </p>
                </div>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      {rows.length === 0 && (
        <Card className="text-muted p-10 text-center text-sm">No vehicles match.</Card>
      )}
    </div>
  );
}
