"use client";

import { useEffect, useState } from "react";

/** Counts a formatted number (e.g. "$58,420.00", "1,248") up from zero on mount. */
export function AnimatedValue({ value }: { value: string }) {
  const m = value.match(/^(\D*)([\d,]+(?:\.(\d+))?)(.*)$/);
  const target = m ? Number(m[2].replace(/,/g, "")) : NaN;
  const decimals = m?.[3]?.length ?? 0;
  const [n, setN] = useState(target);

  useEffect(() => {
    if (
      Number.isNaN(target) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / 900, 1);
      setN(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  if (!m) return <>{value}</>;
  return (
    <>
      {m[1]}
      {n.toLocaleString("en-CA", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {m[4]}
    </>
  );
}
