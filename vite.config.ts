import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    vue(),
    VitePWA({
      workbox: {
        cacheId: "bigice",
        globPatterns: [],
        navigateFallback: null,
        runtimeCaching: [
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|ttf)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "bigice-static",
            },
          },
          {
            urlPattern: /.*\.js.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "bigice-js",
              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
          {
            urlPattern: /.*\.css.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "bigice-css",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
          {
            urlPattern: /.*\.html.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "bigice-html",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
              cacheableResponse: {
                statuses: [200],
              },
            },
          },
        ],
      },
      selfDestroying: false,
    }),
  ],
  esbuild: {
    drop: ["console", "debugger"],
  },
  build: {
    minify: true,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames(assetInfo: any) {
          if (assetInfo.name.endsWith(".css")) {
            return "css/[name]-[hash].css";
          }
          const imgExts = [".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico"];
          if (imgExts.some((ext) => assetInfo.name.endsWith(ext))) {
            return "imgs/[name]-[hash].[ext]";
          }
          return "assets/[name]-[hash].[ext]";
        },
        manualChunks(id: any) {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
