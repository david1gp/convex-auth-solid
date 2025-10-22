import { defineConfig } from "@rsbuild/core"
import { pluginBabel } from "@rsbuild/plugin-babel"
import { pluginSolid } from "@rsbuild/plugin-solid"

export default defineConfig({
  server: {
    port: 3016,
    strictPort: true,
  },
  html: {
    template: "./rsbuild.html",
  },
  source: {
    entry: {
      index: "./src/index.tsx",
    },
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      "@convex": new URL("./convex", import.meta.url).pathname,
      "~ui": new URL("./node_modules/@adaptive-sm/solid-ui/dist", import.meta.url).pathname,
      "~utils": new URL("./node_modules/@adaptive-sm/utils/dist", import.meta.url).pathname,
    },
    dedupe: [
      "solid-js",
      "solid-js/web",
      "solid-js/store",
      "@adaptive-sm/utils",
      "@floating-ui/dom",
      "@mdi/js",
      "@solid-primitives/keyed",
      "@solid-primitives/scheduled",
      "@solidjs/router",
      "clsx",
      "dayjs",
      "tailwind-merge",
      "valibot",
    ],
  },
  plugins: [
    pluginBabel({
      include: /\.(?:jsx|tsx)$/,
    }),
    pluginSolid(),
  ],
  output: {
    distPath: {
      root: "dist",
      html: "",
      js: "assets",
      css: "assets",
      assets: "assets",
      media: "assets",
    },
    target: "web",
    overrideBrowserslist: ["last 2 versions", "not dead"],
    filename: {
      js: "[name].[contenthash:8].js",
    },
  },
  //
  // Rslib v0.4 introduces bundleless mode to preserve the source file structure:
  // https://x.com/rspack_dev/status/1889184235258548634
  //
  // lib: [
  //   {
  //     format: 'esm',
  //     bundle: false,
  //     dts: true,
  //     output: {
  //       distPath: {
  //         root: './dist/esm',
  //       },
  //     },
  //   },
  // ],
  performance: {
    // https://rsbuild.dev/config/performance/bundle-analyze
    // bundleAnalyze: {
    //   analyzerMode: "static",
    //   generateStatsFile: true,
    //   openAnalyzer: true,
    // },
    chunkSplit: {
      strategy: "split-by-experience",
      forceSplitting: {
        "@mdi/js": /node_modules[\\/]@mdi[\\/]js/,
        "tailwind-merge": /node_modules[\\/]tailwind-merge/,
        "posthog-js": /node_modules[\\/]posthog-js/,
      },
    },
  },
})
