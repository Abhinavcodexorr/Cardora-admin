/** Fixed "today" so the static demo renders identically everywhere. */
export const TODAY = new Date("2026-11-22T12:00:00");

export function daysUntil(label: string) {
  return Math.round((new Date(label).getTime() - TODAY.getTime()) / 86_400_000);
}

export type Expiry = "expired" | "expiring" | "active";
export function expiryState(label: string): Expiry {
  const d = daysUntil(label);
  return d < 0 ? "expired" : d <= 90 ? "expiring" : "active";
}

export const toTime = (label: string) => new Date(label).getTime();
