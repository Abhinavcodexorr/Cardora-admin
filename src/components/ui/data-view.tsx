"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import {
  applyFilters,
  FilterBar,
  type FilterDef,
  type SortDef,
} from "@/components/ui/filter-bar";
import { TabBar } from "@/components/ui/tab-bar";

export type Column<T> = {
  header: string;
  cell: (row: T) => React.ReactNode;
  className?: string;
};
export type ViewTab<T> = { id: string; label: string; filter?: (row: T) => boolean };

/**
 * Generic list: optional tabs (with counts), search, table, and a row-detail drawer.
 * The selected row is tracked by key so detail panels stay fresh after local edits.
 */
export function DataView<T>({
  title,
  rows,
  rowKey,
  columns,
  tabs,
  searchText,
  searchPlaceholder = "Search...",
  filters,
  sorts,
  toolbar,
  detail,
  detailTitle,
  detailSubtitle,
  empty = "Nothing to show.",
}: {
  title?: string;
  rows: T[];
  rowKey: (r: T) => string;
  columns: Column<T>[];
  tabs?: ViewTab<T>[];
  searchText?: (r: T) => string;
  searchPlaceholder?: string;
  filters?: FilterDef<T>[];
  sorts?: SortDef<T>[];
  toolbar?: React.ReactNode;
  detail?: (row: T, close: () => void) => React.ReactNode;
  detailTitle?: (r: T) => string;
  detailSubtitle?: (r: T) => string;
  empty?: string;
}) {
  const [tab, setTab] = useState(tabs?.[0]?.id ?? "");
  const [q, setQ] = useState("");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [fv, setFv] = useState<Record<string, string>>({});
  const [sortId, setSortId] = useState(sorts?.[0]?.id ?? "");

  const shown = useMemo(() => {
    const f = tabs?.find((t) => t.id === tab)?.filter;
    const s = q.trim().toLowerCase();
    const base = rows.filter(
      (r) =>
        (!f || f(r)) && (!s || !searchText || searchText(r).toLowerCase().includes(s)),
    );
    return applyFilters(base, filters, fv, sorts, sortId);
  }, [rows, tabs, tab, q, searchText, filters, fv, sorts, sortId]);

  const selected = selectedKey ? rows.find((r) => rowKey(r) === selectedKey) : undefined;

  return (
    <Card className="p-6">
      {(title || searchText || toolbar) && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          <div className="ml-auto flex flex-wrap items-center gap-3">
            {searchText && (
              <div className="relative">
                <Search className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  aria-label={searchPlaceholder}
                  placeholder={searchPlaceholder}
                  className="border-line focus:border-brand-500 h-10 w-60 rounded-xl border pr-3 pl-9 text-sm outline-none"
                />
              </div>
            )}
            {toolbar}
          </div>
        </div>
      )}
      {tabs && (
        <TabBar
          className="mt-4"
          value={tab}
          onChange={setTab}
          tabs={tabs.map((t) => ({
            id: t.id,
            label: t.label,
            count: t.filter ? rows.filter(t.filter).length : rows.length,
          }))}
        />
      )}
      {(filters?.length || sorts?.length) && (
        <FilterBar
          filters={filters}
          values={fv}
          onChange={(id, v) => setFv((p) => ({ ...p, [id]: v }))}
          sorts={sorts}
          sort={sortId}
          onSort={setSortId}
          onClear={() => setFv({})}
          shown={shown.length}
          total={rows.length}
        />
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-muted text-xs">
            <tr>
              {columns.map((c, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`py-3 font-medium ${c.className ?? ""}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-line divide-y">
            {shown.map((r) => (
              <tr
                key={rowKey(r)}
                onClick={detail ? () => setSelectedKey(rowKey(r)) : undefined}
                onKeyDown={
                  detail
                    ? (e) => e.key === "Enter" && setSelectedKey(rowKey(r))
                    : undefined
                }
                tabIndex={detail ? 0 : undefined}
                className={
                  detail
                    ? "focus-visible:bg-brand-50 cursor-pointer outline-none hover:bg-zinc-50"
                    : undefined
                }
              >
                {columns.map((c, i) => (
                  <td key={i} className={`py-3 ${c.className ?? ""}`}>
                    {c.cell(r)}
                  </td>
                ))}
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-muted py-10 text-center">
                  {empty}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selected && detail && (
        <Drawer
          title={detailTitle?.(selected) ?? "Details"}
          subtitle={detailSubtitle?.(selected)}
          onClose={() => setSelectedKey(null)}
        >
          {detail(selected, () => setSelectedKey(null))}
        </Drawer>
      )}
    </Card>
  );
}
