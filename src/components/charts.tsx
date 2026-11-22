"use client";

import { useState } from "react";

export type Point = { label: string; value: number };

/** Smooth path through points (Catmull-Rom → cubic Bézier). */
function smooth(pts: [number, number][]) {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6}, ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6}, ${p2[0]} ${p2[1]}`;
  }
  return d;
}

export function Sparkline({
  values,
  className,
  color = "#00af66",
}: {
  values: number[];
  className?: string;
  color?: string;
}) {
  const W = 80,
    H = 28;
  const min = Math.min(...values),
    max = Math.max(...values);
  const pts = values.map((v, i): [number, number] => [
    (i * W) / (values.length - 1),
    H - 3 - ((v - min) / (max - min || 1)) * (H - 6),
  ]);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} aria-hidden>
      <path
        d={smooth(pts)}
        pathLength={1}
        className="animate-draw"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Interactive area chart with hover tooltip. */
export function AreaChart({
  series,
  unit = "",
  id = "area",
}: {
  series: Point[];
  unit?: string;
  id?: string;
}) {
  const W = 560,
    H = 190,
    PX = 12,
    PY = 16;
  const [hover, setHover] = useState<number | null>(null);
  const vals = series.map((s) => s.value);
  const hi = Math.max(...vals);
  const spread = hi - Math.min(...vals) || hi * 0.1;
  const lo = Math.max(0, Math.min(...vals) - spread * 0.6);
  const top = hi + spread * 0.25;
  const pts = series.map((s, i): [number, number] => [
    PX + (i * (W - PX * 2)) / (series.length - 1),
    H - PY - ((s.value - lo) / (top - lo)) * (H - PY * 2),
  ]);
  const line = smooth(pts);
  const area = `${line} L ${pts.at(-1)![0]} ${H} L ${pts[0][0]} ${H} Z`;
  const active = hover ?? series.length - 1;
  const step = (W - PX * 2) / (series.length - 1);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Trend chart, latest ${series.at(-1)!.value}${unit}`}
        className="h-auto w-full"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * W;
          setHover(Math.max(0, Math.min(series.length - 1, Math.round((x - PX) / step))));
        }}
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#00af66" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#00af66" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line
            key={g}
            x1={PX}
            x2={W - PX}
            y1={H - PY - g * (H - PY * 2)}
            y2={H - PY - g * (H - PY * 2)}
            style={{ stroke: "var(--border)" }}
            strokeDasharray="3 4"
          />
        ))}
        <path d={area} className="animate-fade-in" fill={`url(#${id}-fill)`} />
        <path
          d={line}
          pathLength={1}
          className="animate-draw"
          fill="none"
          stroke="#00af66"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1={pts[active][0]}
          x2={pts[active][0]}
          y1={PY / 2}
          y2={H}
          stroke="#00af66"
          strokeOpacity="0.3"
        />
        <circle
          cx={pts[active][0]}
          cy={pts[active][1]}
          r="5"
          fill="#00af66"
          style={{ stroke: "var(--surface)" }}
          strokeWidth="2"
        />
      </svg>
      <div
        className="bg-inverse pointer-events-none absolute -top-1 -translate-x-1/2 rounded-lg px-2.5 py-1 text-xs whitespace-nowrap text-white"
        style={{ left: `${(pts[active][0] / W) * 100}%` }}
      >
        {series[active].label}:{" "}
        <b>
          {series[active].value}
          {unit}
        </b>
      </div>
      <div className="text-muted mt-1 flex justify-between text-xs">
        {series.map((s) => (
          <span key={s.label}>{s.label}</span>
        ))}
      </div>
    </div>
  );
}

/** Grouped vertical bars. */
export function BarChart({
  data,
  keys,
}: {
  data: ({ label: string } & Record<string, number | string>)[];
  keys: { key: string; color: string; name: string }[];
}) {
  const max = Math.max(...data.flatMap((d) => keys.map((k) => Number(d[k.key])))) * 1.1;
  return (
    <div>
      <div className="flex h-48 items-end gap-3" role="img" aria-label="Bar chart">
        {data.map((d) => (
          <div
            key={d.label}
            className="flex h-full flex-1 items-end justify-center gap-1"
          >
            {keys.map((k) => (
              <div
                key={k.key}
                title={`${k.name}: ${d[k.key]}`}
                className="w-full max-w-5 rounded-t-md"
                style={{
                  height: `${(Number(d[k.key]) / max) * 100}%`,
                  background: k.color,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="text-muted mt-2 flex gap-3 text-xs">
        {data.map((d) => (
          <span key={d.label} className="flex-1 text-center">
            {d.label}
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-xs">
        {keys.map((k) => (
          <span key={k.key} className="inline-flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm" style={{ background: k.color }} />{" "}
            {k.name}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Horizontal labelled bars (funnels, breakdowns). */
export function HBars({
  rows,
}: {
  rows: { label: string; value: number; hint?: string }[];
}) {
  const max = Math.max(...rows.map((r) => r.value));
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium">{r.label}</span>
            <span className="text-muted">{r.hint ?? r.value}</span>
          </div>
          <div className="h-2.5 rounded-full bg-zinc-100">
            <div
              className="bg-brand-500 h-full rounded-full"
              style={{ width: `${(r.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
