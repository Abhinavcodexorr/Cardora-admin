"use client";

import { Moon, Sun } from "lucide-react";
import { applyTheme } from "@/lib/theme";

/** Icons swap with CSS (`dark:`), so there is no hydration mismatch. */
export function ThemeToggle() {
  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      onClick={() =>
        applyTheme(document.documentElement.classList.contains("dark") ? "light" : "dark")
      }
      className="rounded-xl p-2.5 hover:bg-zinc-100"
    >
      <Moon className="size-5 dark:hidden" strokeWidth={1.75} />
      <Sun className="hidden size-5 dark:block" strokeWidth={1.75} />
    </button>
  );
}
