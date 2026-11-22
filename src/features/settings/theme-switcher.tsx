"use client";

import { useSyncExternalStore } from "react";
import { Segmented } from "@/components/ui/tab-bar";
import { applyTheme, getStoredTheme, subscribeTheme, type ThemeMode } from "@/lib/theme";

export function ThemeSwitcher() {
  const mode = useSyncExternalStore<ThemeMode>(
    subscribeTheme,
    getStoredTheme,
    () => "system",
  );
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium">Appearance</p>
      <Segmented
        label="Theme"
        value={mode}
        onChange={(m) => applyTheme(m as ThemeMode)}
        options={[
          { id: "light", label: "Light" },
          { id: "dark", label: "Dark" },
          { id: "system", label: "System" },
        ]}
      />
      <p className="text-muted mt-1 text-xs">System follows your device setting.</p>
    </div>
  );
}
