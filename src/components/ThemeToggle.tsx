"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[104px] h-9" />; // Placeholder
  }

  return (
    <div className="flex items-center bg-slate-200 dark:bg-slate-800 rounded-lg p-1">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-md transition-colors ${
          theme === "light"
            ? "bg-white dark:bg-slate-700 shadow-sm text-ink dark:text-slate-200"
            : "text-slate-500 hover:text-ink dark:hover:text-slate-300"
        }`}
        title="Light Mode"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-md transition-colors ${
          theme === "system"
            ? "bg-white dark:bg-slate-700 shadow-sm text-ink dark:text-slate-200"
            : "text-slate-500 hover:text-ink dark:hover:text-slate-300"
        }`}
        title="System Preference"
      >
        <Monitor size={16} />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-md transition-colors ${
          theme === "dark"
            ? "bg-white dark:bg-slate-700 shadow-sm text-ink dark:text-slate-200"
            : "text-slate-500 hover:text-ink dark:hover:text-slate-300"
        }`}
        title="Dark Mode"
      >
        <Moon size={16} />
      </button>
    </div>
  );
}
