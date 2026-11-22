export type ThemeMode = "light" | "dark" | "system";
export const THEME_KEY = "theme";

/**
 * Runs before first paint (inlined in <head>) so there is no light-theme flash.
 * Falls back to the OS preference when the user has not chosen.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})();`;

export function getStoredTheme(): ThemeMode {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === "dark" || t === "light" ? t : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(mode: ThemeMode) {
  const dark =
    mode === "dark" ||
    (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", dark);
  try {
    if (mode === "system") localStorage.removeItem(THEME_KEY);
    else localStorage.setItem(THEME_KEY, mode);
  } catch {
    /* storage unavailable: theme still applies for this session */
  }
  window.dispatchEvent(new Event("themechange"));
}

/** For useSyncExternalStore: re-read the stored mode when it changes. */
export function subscribeTheme(cb: () => void) {
  window.addEventListener("themechange", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("themechange", cb);
    window.removeEventListener("storage", cb);
  };
}
