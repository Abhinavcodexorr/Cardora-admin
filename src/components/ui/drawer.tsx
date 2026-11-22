"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Portal } from "./portal";

export function Drawer({
  title,
  subtitle,
  onClose,
  children,
  footer,
  side = "right",
  width = "max-w-[480px]",
}: {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  side?: "left" | "right";
  width?: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <Portal>
      <div className="fixed inset-0 z-40">
        <div className="absolute inset-0 bg-black/30" onClick={onClose} aria-hidden />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            "animate-slide-in bg-surface absolute inset-y-0 flex w-full flex-col shadow-2xl",
            side === "right" ? "right-0" : "left-0",
            width,
          )}
        >
          <header className="border-line flex items-start justify-between gap-3 border-b p-5">
            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold">{title}</h2>
              {subtitle && <p className="text-muted truncate text-sm">{subtitle}</p>}
            </div>
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 hover:bg-zinc-100"
            >
              <X className="size-5" />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto p-5">{children}</div>
          {footer && <footer className="border-line border-t p-4">{footer}</footer>}
        </aside>
      </div>
    </Portal>
  );
}
