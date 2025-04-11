import React from "react";
import { useTheme } from "../hooks/useTheme.ts";

const ThemeToggleButton: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";
  const icon = isDark ? "☀️" : "🌙";
  const title = `Switch to ${isDark ? "light" : "dark"} theme`;

  return (
    <button
      className="theme-toggle-button"
      onClick={toggleTheme}
      title={title}
      aria-label={title}
    >
      <span>{icon}</span>
    </button>
  );
};

export default ThemeToggleButton;
