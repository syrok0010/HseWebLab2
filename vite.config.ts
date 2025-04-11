import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repositoryName = "HseWebLab2";

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  const base = command === "build" ? `/${repositoryName}/` : "/";
  return {
    plugins: [react()],
    base: base,
  };
});
