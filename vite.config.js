import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function getBasePath() {
  const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
  if (!repo) return "/";
  if (repo.endsWith(".github.io")) return "/";
  return `/${repo}/`;
}

export default defineConfig({
  plugins: [react()],
  base: getBasePath(),
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("node_modules/scheduler")) return "react";
          if (id.includes("node_modules/framer-motion")) return "motion";
          if (id.includes("node_modules/react-markdown")) return "markdown";
          if (id.includes("node_modules/lucide-react")) return "icons";
        },
      },
    },
  },
});
