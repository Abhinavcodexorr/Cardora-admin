import { useId } from "react";
import { cn } from "@/lib/utils";

const sedans = [
  "civic",
  "a4",
  "camry",
  "accord",
  "corolla",
  "3 series",
  "elantra",
  "mazda3",
];
const bodyFor = (model = "") =>
  sedans.some((s) => model.toLowerCase().includes(s)) ? "sedan" : "suv";

const named: Record<string, string> = {
  "alpine white": "#f1f2f3",
  "glacier white": "#f1f2f3",
  "platinum white": "#e8eaec",
  "navarra blue": "#27457f",
  "cavalry blue": "#3a6286",
  "amazon gray": "#6a6e72",
  "mineral grey": "#5b6066",
  "soul red": "#a3141e",
  "black sapphire": "#16191f",
  "mythos black": "#13161a",
  silver: "#b4b8bd",
};
const palette = ["#5b6066", "#f1f2f3", "#16191f", "#27457f", "#a3141e", "#b4b8bd"];

function colorFor(color: string | undefined, seed: string) {
  if (color?.startsWith("#")) return color;
  if (color && named[color.toLowerCase()]) return named[color.toLowerCase()];
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return palette[h % palette.length];
}

// Side views facing right. Ground line is y=176; wheel centres sit at y=150.
const BODY = {
  suv: {
    body: "M48 152 L44 124 Q43 104 52 90 L82 56 Q90 44 108 42 L196 38 Q232 36 250 54 L288 94 Q294 100 308 102 L346 108 Q366 112 368 130 L368 152 Z",
    glass: [
      "M88 90 L100 62 Q104 54 114 53 L150 52 L150 90 Z",
      "M158 52 L198 51 Q226 50 242 64 L272 90 L158 90 Z",
    ],
    rails: "M108 34 L238 34",
    seams: [154, 248],
    handles: [128, 186],
    belt: 90,
    shoulder: "M50 100 Q200 92 344 108",
    wheels: [96, 304],
    head: "M338 108 L366 114 L366 121 L336 116 Z",
    tail: "M44 98 L50 96 L52 118 L45 120 Z",
    mirror: [262, 92],
    intake: [334, 140, 32],
  },
  sedan: {
    body: "M46 152 L40 124 Q38 112 50 108 L96 102 Q118 100 134 82 L166 56 Q176 48 194 48 L228 48 Q248 48 262 62 L292 96 L324 102 Q356 106 366 118 Q370 124 370 134 L370 152 Z",
    glass: [
      "M144 92 L170 62 Q176 56 188 56 L210 56 L210 92 Z",
      "M218 56 L232 56 Q246 56 254 66 L278 92 L218 92 Z",
    ],
    rails: "",
    seams: [214, 262],
    handles: [158, 232],
    belt: 94,
    shoulder: "M48 106 Q200 98 346 110",
    wheels: [104, 304],
    head: "M342 108 L368 118 L368 124 L340 118 Z",
    tail: "M40 112 L46 110 L48 126 L41 128 Z",
    mirror: [258, 94],
    intake: [336, 142, 32],
  },
} as const;

/** Illustrated side-view car, tinted by paint colour. Size it with className on the wrapper. */
export function CarImage({
  make,
  model,
  color,
  seed = "",
  className,
}: {
  make: string;
  model: string;
  color?: string;
  seed?: string;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const b = BODY[bodyFor(model)];
  const base = colorFor(color, seed || `${make}${model}`);
  const id = (k: string) => `${uid}${k}`;

  return (
    <div
      className={cn(
        "overflow-hidden bg-gradient-to-b from-zinc-50 to-zinc-200",
        className,
      )}
    >
      <svg
        viewBox="0 0 400 200"
        role="img"
        aria-label={`${make} ${model}`}
        className="size-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <clipPath id={id("c")}>
            <path d={b.body} />
          </clipPath>
          <linearGradient id={id("v")} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.42" />
            <stop offset="0.35" stopColor="#fff" stopOpacity="0.04" />
            <stop offset="0.75" stopColor="#000" stopOpacity="0.06" />
            <stop offset="1" stopColor="#000" stopOpacity="0.42" />
          </linearGradient>
          <linearGradient id={id("h")} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.3" stopColor="#fff" stopOpacity="0.2" />
            <stop offset="0.65" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id={id("w")} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#52667c" />
            <stop offset="0.5" stopColor="#1f2c3a" />
            <stop offset="1" stopColor="#0c1219" />
          </linearGradient>
          <linearGradient id={id("s")} x1="0" x2="1" y1="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.22" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={id("r")} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#f4f6f7" />
            <stop offset="1" stopColor="#7d858c" />
          </linearGradient>
          <radialGradient id={id("sh")}>
            <stop offset="0" stopColor="#000" stopOpacity="0.38" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="208" cy="177" rx="190" ry="10" fill={`url(#${id("sh")})`} />

        {b.rails && (
          <path d={b.rails} stroke="#2a2d31" strokeWidth="3" strokeLinecap="round" />
        )}

        <path d={b.body} fill={base} />
        <g clipPath={`url(#${id("c")})`}>
          <rect width="400" height="200" fill={`url(#${id("v")})`} />
          <rect width="400" height="200" fill={`url(#${id("h")})`} />
          {/* lower cladding + sill */}
          <rect x="0" y="136" width="400" height="20" fill="#0b0d10" opacity="0.55" />
          {/* shoulder line highlight + shadow */}
          <path
            d={b.shoulder}
            stroke="#fff"
            strokeOpacity="0.4"
            strokeWidth="1.6"
            fill="none"
          />
          <path
            d={b.shoulder}
            transform="translate(0 3)"
            stroke="#000"
            strokeOpacity="0.18"
            strokeWidth="2"
            fill="none"
          />
          {/* door seams */}
          {b.seams.map((x) => (
            <line
              key={x}
              x1={x}
              x2={x}
              y1={b.belt}
              y2="138"
              stroke="#000"
              strokeOpacity="0.32"
              strokeWidth="1.2"
            />
          ))}
          {/* handles */}
          {b.handles.map((x) => (
            <rect
              key={x}
              x={x}
              y={b.belt + 8}
              width="15"
              height="3.2"
              rx="1.6"
              fill="#000"
              fillOpacity="0.38"
            />
          ))}
          {/* wheel arches */}
          {b.wheels.map((x) => (
            <g key={x}>
              <circle cx={x} cy="150" r="36" fill="#07090b" />
              <circle
                cx={x}
                cy="150"
                r="36"
                fill="none"
                stroke="#000"
                strokeOpacity="0.5"
                strokeWidth="4"
              />
            </g>
          ))}
          {/* rim light along the top edge */}
          <path
            d={b.body}
            fill="none"
            stroke="#fff"
            strokeOpacity="0.22"
            strokeWidth="2"
          />
        </g>

        {/* glass */}
        {b.glass.map((d) => (
          <g key={d}>
            <path d={d} fill={`url(#${id("w")})`} />
            <path d={d} fill={`url(#${id("s")})`} />
          </g>
        ))}
        {/* mirror */}
        <path
          d={`M${b.mirror[0] - 9} ${b.mirror[1]} Q${b.mirror[0]} ${b.mirror[1] - 8} ${b.mirror[0] + 9} ${b.mirror[1] - 1} L${b.mirror[0] + 7} ${b.mirror[1] + 5} L${b.mirror[0] - 7} ${b.mirror[1] + 5} Z`}
          fill={base}
          stroke="#000"
          strokeOpacity="0.35"
        />
        {/* lights + intake */}
        <path d={b.head} fill="#fff8dc" />
        <path d={b.head} fill="none" stroke="#9aa0a6" strokeWidth="1" />
        <path d={b.tail} fill="#d7202c" />
        <rect
          x={b.intake[0]}
          y={b.intake[1]}
          width={b.intake[2]}
          height="7"
          rx="2"
          fill="#07090b"
          opacity="0.85"
        />

        {/* wheels */}
        {b.wheels.map((x) => (
          <g key={x}>
            <circle cx={x} cy="150" r="27" fill="#101214" />
            <circle
              cx={x}
              cy="150"
              r="22.5"
              fill="none"
              stroke="#2c3034"
              strokeWidth="1.2"
            />
            <circle cx={x} cy="150" r="19" fill="#2a2e32" />
            <circle cx={x} cy="150" r="13" fill="#4a4f55" />
            <circle
              cx={x}
              cy="150"
              r="17.5"
              fill="none"
              stroke={`url(#${id("r")})`}
              strokeWidth="2.4"
            />
            {[0, 72, 144, 216, 288].map((a) => (
              <path
                key={a}
                d={`M${x} ${150 - 5} L${x} ${150 - 16}`}
                stroke={`url(#${id("r")})`}
                strokeWidth="5"
                strokeLinecap="round"
                transform={`rotate(${a} ${x} 150)`}
              />
            ))}
            <circle cx={x} cy="150" r="5" fill="#cfd4d8" />
            <circle cx={x} cy="150" r="2" fill="#6a7077" />
          </g>
        ))}
      </svg>
    </div>
  );
}
