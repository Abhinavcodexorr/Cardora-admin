import { Megaphone, Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button";
import { TODAY } from "@/lib/dates";

export function Hero({
  name,
  attention,
  tiles,
}: {
  name: string;
  attention: number;
  tiles: { label: string; value: string }[];
}) {
  const date = TODAY.toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a0a0a] via-[#06241a] to-[#005c37] p-6 text-white shadow-[0_20px_50px_-20px_rgb(0_92_55/0.6)] sm:p-8">
      <svg
        aria-hidden
        viewBox="0 0 400 400"
        className="animate-fade-in pointer-events-none absolute -top-24 -right-16 size-[28rem] opacity-30"
      >
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="#00af66"
          strokeWidth="28"
          strokeLinecap="round"
          strokeDasharray="620 400"
          transform="rotate(-40 200 200)"
        />
        <circle
          cx="200"
          cy="200"
          r="95"
          fill="none"
          stroke="#33c285"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray="300 400"
          transform="rotate(140 200 200)"
        />
      </svg>
      <span
        aria-hidden
        className="bg-brand-500/30 pointer-events-none absolute -bottom-24 left-1/3 size-64 rounded-full blur-3xl"
      />

      <div className="relative flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-1.5 text-sm font-medium text-[#9be7c4]">
            <Sparkles className="size-4" /> {date}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back, {name}
          </h1>
          <p className="mt-2 text-sm text-white/70">
            <b className="text-white">{attention} items</b> need your attention across
            customers, requests and contracts.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/customers/new"
              className={buttonStyles("primary", "shadow-lg shadow-black/20")}
            >
              <Plus className="size-4" /> Add customer
            </Link>
            <Link
              href="/campaigns"
              className={buttonStyles(
                "ghost",
                "border border-white/20 text-white hover:bg-white/10",
              )}
            >
              <Megaphone className="size-4" /> New campaign
            </Link>
          </div>
        </div>
        <ul className="grid w-full grid-cols-3 gap-3 sm:w-auto">
          {tiles.map((t) => (
            <li
              key={t.label}
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm"
            >
              <p className="text-2xl font-bold tabular-nums">{t.value}</p>
              <p className="text-xs text-white/70">{t.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
