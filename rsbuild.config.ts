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
    define: {
      "import.meta.env.MODE": JSON.stringify(process.env.NODE_ENV),
      "import.meta.env.PUBLIC_ENV_MODE": JSON.stringify(process.env.PUBLIC_ENV_MODE),
      "import.meta.env.PUBLIC_BASE_URL_SITE": JSON.stringify(process.env.PUBLIC_BASE_URL_SITE),
      "import.meta.env.PUBLIC_BASE_URL_APP": JSON.stringify(process.env.PUBLIC_BASE_URL_APP),
      "import.meta.env.PUBLIC_BASE_URL_CONVEX": JSON.stringify(process.env.PUBLIC_BASE_URL_CONVEX),
      "import.meta.env.PUBLIC_BASE_URL_API": JSON.stringify(process.env.PUBLIC_BASE_URL_API),
      "import.meta.env.PUBLIC_GITHUB_CLIENT_ID": JSON.stringify(process.env.PUBLIC_GITHUB_CLIENT_ID),
      "import.meta.env.PUBLIC_GOOGLE_CLIENT_ID": JSON.stringify(process.env.PUBLIC_GOOGLE_CLIENT_ID),
      "import.meta.env.PUBLIC_MICROSOFT_CLIENT_ID": JSON.stringify(process.env.PUBLIC_MICROSOFT_CLIENT_ID),
      "import.meta.env.PUBLIC_B2_OBJECT_STORAGE_DOWNLOAD_URL": JSON.stringify(
        process.env.PUBLIC_B2_OBJECT_STORAGE_DOWNLOAD_URL,
      ),
      "import.meta.env.PUBLIC_POSTHOG_APP_ID": JSON.stringify(process.env.PUBLIC_POSTHOG_APP_ID),
    },
  },
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
      "@convex": new URL("./convex", import.meta.url).pathname,
      "~ui": new URL("./node_modules/@adaptive-ds/solid-ui/dist", import.meta.url).pathname,
      "~utils": new URL("./node_modules/@adaptive-ds/utils/dist", import.meta.url).pathname,
    },
    dedupe: [
      "solid-js",
      "solid-js/web",
      "solid-js/store",
      "@adaptive-ds/utils",
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
