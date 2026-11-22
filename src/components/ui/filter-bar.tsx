"use client";

import { ArrowUpDown, ChevronDown, ListFilter, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type FilterDef<T> = {
  id: string;
  label: string;
  allLabel: string;
  options: { value: string; label: string }[];
  test: (row: T, value: string) => boolean;
};
export type SortDef<T> = { id: string; label: string; compare: (a: T, b: T) => number };

export const ALL = "all";

/** Unique, sorted option list built from the rows themselves. */
export function uniqueOptions<T>(
  rows: T[],
  get: (r: T) => string | number | undefined | null,
) {
  const set = new Set<string>();
  for (const r of rows) {
    const v = get(r);
    if (v !== undefined && v !== null && v !== "") set.add(String(v));
  }
  return [...set]
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((v) => ({ value: v, label: v }));
}

export function applyFilters<T>(
  rows: T[],
  filters: FilterDef<T>[] | undefined,
  values: Record<string, string>,
  sorts: SortDef<T>[] | undefined,
  sortId: string,
) {
  let out = rows.filter((r) =>
    (filters ?? []).every(
      (f) => !values[f.id] || values[f.id] === ALL || f.test(r, values[f.id]),
    ),
  );
  const s = sorts?.find((x) => x.id === sortId);
  if (s) out = [...out].sort(s.compare);
  return out;
}

function Select({
  label,
  value,
  onChange,
  active,
  children,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  active?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <label
      className={cn(
        "relative inline-flex h-9 items-center rounded-xl border text-sm transition-colors",
        active
          ? "border-brand-500 bg-brand-50 text-brand-700"
          : "border-line bg-surface hover:border-zinc-300",
      )}
    >
      {icon && <span className="pointer-events-none pl-2.5">{icon}</span>}
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-full cursor-pointer appearance-none bg-transparent pr-8 font-medium outline-none",
          icon ? "pl-1.5" : "pl-3",
        )}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 size-3.5 opacity-60" />
    </label>
  );
}

export function FilterBar<T>({
  filters,
  values,
  onChange,
  sorts,
  sort,
  onSort,
  onClear,
  shown,
  total,
}: {
  filters?: FilterDef<T>[];
  values: Record<string, string>;
  onChange: (id: string, v: string) => void;
  sorts?: SortDef<T>[];
  sort: string;
  onSort: (id: string) => void;
  onClear: () => void;
  shown: number;
  total: number;
}) {
  const activeCount = (filters ?? []).filter(
    (f) => values[f.id] && values[f.id] !== ALL,
  ).length;
  return (
    <div
      className="mt-4 flex flex-wrap items-center gap-2"
      role="group"
      aria-label="Filters"
    >
      <span className="text-muted mr-1 inline-flex items-center gap-1.5 text-sm font-medium">
        <ListFilter className="size-4" /> Filters
        {activeCount > 0 && (
          <span className="bg-brand-500 rounded-full px-1.5 text-xs text-white">
            {activeCount}
          </span>
        )}
      </span>
      {filters?.map((f) => (
        <Select
          key={f.id}
          label={f.label}
          value={values[f.id] ?? ALL}
          onChange={(v) => onChange(f.id, v)}
          active={(values[f.id] ?? ALL) !== ALL}
        >
          <option value={ALL}>{f.allLabel}</option>
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      ))}
      {activeCount > 0 && (
        <button
          onClick={onClear}
          className="text-brand-600 inline-flex h-9 items-center gap-1 rounded-xl px-2 text-sm font-medium hover:underline"
        >
          <X className="size-3.5" /> Clear
        </button>
      )}
      <span className="ml-auto flex items-center gap-3">
        <span className="text-muted hidden text-xs sm:inline">
          Showing {shown} of {total}
        </span>
        {sorts && sorts.length > 0 && (
          <Select
            label="Sort by"
            value={sort}
            onChange={onSort}
            icon={<ArrowUpDown className="size-3.5 opacity-60" />}
          >
            {sorts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
        )}
      </span>
    </div>
  );
}
