"use client";

import { CheckCircle2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Portal } from "./portal";

/** Tiny hook: `const [toast, show] = useToast()` → render `{toast}` once in the view. */
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!msg) return;
    const t = setTimeout(() => setMsg(null), 3200);
    return () => clearTimeout(t);
  }, [msg]);
  const show = useCallback((m: string) => setMsg(m), []);
  const node = msg ? (
    <Portal>
      <div
        role="status"
        className="bg-inverse fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-white shadow-xl"
      >
        <CheckCircle2 className="text-brand-400 size-4" /> {msg}
      </div>
    </Portal>
  ) : null;
  return [node, show] as const;
}
