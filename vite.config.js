import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { VitePluginRadar } from "vite-plugin-radar";


export default defineConfig({
  plugins: [
    react(),
    VitePluginRadar({
      // Google Analytics tag injection
      analytics: {
        id: "G-170QFT5NHJ",
      },
    }),
  ],
  define: {
    'import.meta.env.VITE_CLARITY_PROJECT_ID': JSON.stringify(process.env.VITE_CLARITY_PROJECT_ID),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
