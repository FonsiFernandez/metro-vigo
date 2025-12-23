export type Theme = "light" | "dark";

const KEY = "metro-theme";

export function getStoredTheme(): Theme | null {
  const v = localStorage.getItem(KEY);
  return v === "dark" || v === "light" ? v : null;
}

export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  localStorage.setItem(KEY, theme);
}

export function initTheme() {
  const stored = getStoredTheme();
  if (stored) return applyTheme(stored);

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}
