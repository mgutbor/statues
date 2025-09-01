import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
  },
  server: {
    historyApiFallback: true,
  },
  plugins: [
    VitePWA({
      manifest: {
        name: "Statues - Red Light, Green Light",
        short_name: "Statues",
        description: "A fun game based on the Squid Game series",
        display: "standalone",
        theme_color: "#08424f",
        background_color: "#08424f",
        start_url: "/",
        icons: [
          {
            src: "/images/icon_small.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/images/icon_medium.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        screenshots: [
          {
            src: "/images/desktop.png",
            sizes: "1708x1097",
            type: "image/png",
            form_factor: "wide",
          },
          {
            src: "/images/mobile.png",
            sizes: "428x935",
            type: "image/png",
            form_factor: "mobile",
          },
        ],
      },
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,mp3}"],
        runtimeCaching: [
          {
            urlPattern: /\/audio\/.*\.mp3$/,
            handler: "CacheFirst",
            options: {
              cacheName: "audio-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
            },
          },
          {
            urlPattern: /\.(?:png|svg)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "google-fonts-stylesheets",
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
});