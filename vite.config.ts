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
    allowedHosts: ["convex-auth.dev"],
    fs: {
      // Allow serving files from one level up to the project root
      allow: [".."],
    },
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      "@convex": new URL("./convex", import.meta.url).pathname,
      "~ui": new URL("./node_modules/@adaptive-ds/solid-ui/dist", import.meta.url).pathname,
      "~utils": new URL("./node_modules/@adaptive-ds/utils/dist", import.meta.url).pathname,
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
