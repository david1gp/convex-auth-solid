import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"

export default defineConfig({
  server: {
    port: 3016,
    strictPort: true,
    watch: {
      ignored: ["**/.github/**", "**/data/**", "**/dist/**", "**/ops/**", "**/out/**", "**/docs/**", "**/test/**"],
    },
    allowedHosts: ["convex-auth.dev", "app.convex-auth.com"],
    fs: {
      // Allow serving files from one level up to the project root
      allow: [".."],
    },
  },
  plugins: [solid(), tailwindcss()],
  envPrefix: "PUBLIC_",
  define: {
    development: JSON.stringify("development"),
  },
  build: {
    chunkSizeWarningLimit: 1050,
    outDir: "out",
    assetsDir: "assets",
  },
})
