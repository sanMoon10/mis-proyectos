import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()], // Plugins de React
  server: {
    proxy: {
      "/api": {
        target: "https://x8ki-letl-twmt.n7.xano.io",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
