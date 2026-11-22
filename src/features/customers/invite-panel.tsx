"use client";

import { Mail, MessageSquare, QrCode } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/** Deterministic decorative QR-style pattern (static demo — not a scannable code). */
function FakeQr({ seed }: { seed: string }) {
  const n = 21;
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const cells: boolean[] = [];
  for (let i = 0; i < n * n; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    cells.push((h >>> 16) % 2 === 0);
  }
  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  return (
    <svg
      viewBox={`0 0 ${n} ${n}`}
      className="size-40"
      role="img"
      aria-label="Sample QR code (demo)"
    >
      <rect width={n} height={n} fill="#fff" />
      {cells.map((on, i) => {
        const x = i % n;
        const y = Math.floor(i / n);
        return on && !finder(x, y) ? (
          <rect key={i} x={x} y={y} width="1" height="1" fill="#0a0a0a" />
        ) : null;
      })}
      {[
        [0, 0],
        [n - 7, 0],
        [0, n - 7],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="7" height="7" fill="#0a0a0a" />
          <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
          <rect x={x + 2} y={y + 2} width="3" height="3" fill="#00af66" />
        </g>
      ))}
    </svg>
  );
}

export function InvitePanel({
  customerId,
  mobile,
  email,
  ready,
  sent,
  onSent,
}: {
  customerId: string;
  mobile: string;
  email: string;
  ready: boolean;
  sent: boolean;
  onSent: () => void;
}) {
  const [qr, setQr] = useState(false);
  const [note, setNote] = useState("");

  const send = (via: string) => {
    onSent();
    setNote(
      `${sent ? "Invitation resent" : "Invitation marked as sent"} via ${via}. Demo only: nothing is actually delivered.`,
    );
  };

  return (
    <div>
      <h3 className="font-semibold">App invitation</h3>
      <p className="text-muted mt-1 text-sm">
        The customer downloads the app, verifies with a one-time code, and sees their
        pre-filled account.
      </p>
      {!ready && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          Complete the profile (name, mobile, email, address) before inviting.
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="dark" disabled={!ready || !mobile} onClick={() => send("SMS")}>
          <MessageSquare className="size-4" /> {sent ? "Resend SMS" : "Send SMS"}
        </Button>
        <Button disabled={!ready || !email} onClick={() => send("email")}>
          <Mail className="size-4" /> {sent ? "Resend Email" : "Send Email"}
        </Button>
        <Button disabled={!ready} onClick={() => setQr((v) => !v)} aria-expanded={qr}>
          <QrCode className="size-4" /> {qr ? "Hide QR" : "Show QR"}
        </Button>
      </div>
      {note && (
        <p
          role="status"
          className="bg-brand-50 text-brand-700 mt-3 rounded-lg p-3 text-sm"
        >
          {note}
        </p>
      )}
      {qr && ready && (
        <div className="border-line mt-4 inline-block rounded-2xl border p-3">
          <FakeQr seed={customerId} />
          <p className="text-muted mt-1 text-center text-xs">Sample code (demo)</p>
        </div>
      )}
    </div>
  );
}
