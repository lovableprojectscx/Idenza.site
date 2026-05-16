// vite.config.ts
import { defineConfig } from "file:///sessions/zen-nice-davinci/mnt/Idenza-main/node_modules/vite/dist/node/index.js";
import react from "file:///sessions/zen-nice-davinci/mnt/Idenza-main/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { componentTagger } from "file:///sessions/zen-nice-davinci/mnt/Idenza-main/node_modules/lovable-tagger/dist/index.js";
var __vite_injected_original_dirname = "/sessions/zen-nice-davinci/mnt/Idenza-main";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: { overlay: false }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: { "@": path.resolve(__vite_injected_original_dirname, "./src") }
  },
  build: {
    // Target modern browsers — allows smaller output, no legacy polyfills
    target: "esnext",
    // esbuild minifier is ~10x faster than terser with negligible size diff
    minify: "esbuild",
    // No sourcemaps in production — shaves ~30% off bundle transfer
    sourcemap: false,
    // Split CSS per chunk so route CSS is only loaded when needed
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime — loaded on every page, cached aggressively
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          // Data layer — separate from UI so cache survives component updates
          "vendor-query": ["@tanstack/react-query"],
          // Animation library — large (~40kb gz), only needed on marketing pages
          "vendor-motion": ["framer-motion"],
          // Charts — only used in admin/dashboard routes, never on public pages
          "vendor-charts": ["recharts"],
          // Supabase — auth & DB client, only needed post-login
          "vendor-supabase": ["@supabase/supabase-js"],
          // Radix UI primitives — shared across many components, stable cache
          "vendor-radix": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-tooltip",
            "@radix-ui/react-tabs",
            "@radix-ui/react-select",
            "@radix-ui/react-popover",
            "@radix-ui/react-toast",
            "@radix-ui/react-accordion",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-label",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-switch"
          ]
        }
      }
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvc2Vzc2lvbnMvemVuLW5pY2UtZGF2aW5jaS9tbnQvSWRlbnphLW1haW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9zZXNzaW9ucy96ZW4tbmljZS1kYXZpbmNpL21udC9JZGVuemEtbWFpbi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vc2Vzc2lvbnMvemVuLW5pY2UtZGF2aW5jaS9tbnQvSWRlbnphLW1haW4vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyBjb21wb25lbnRUYWdnZXIgfSBmcm9tIFwibG92YWJsZS10YWdnZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCI6OlwiLFxuICAgIHBvcnQ6IDgwODAsXG4gICAgaG1yOiB7IG92ZXJsYXk6IGZhbHNlIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIG1vZGUgPT09IFwiZGV2ZWxvcG1lbnRcIiAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgXS5maWx0ZXIoQm9vbGVhbiksXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogeyBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIC8vIFRhcmdldCBtb2Rlcm4gYnJvd3NlcnMgXHUyMDE0IGFsbG93cyBzbWFsbGVyIG91dHB1dCwgbm8gbGVnYWN5IHBvbHlmaWxsc1xuICAgIHRhcmdldDogXCJlc25leHRcIixcbiAgICAvLyBlc2J1aWxkIG1pbmlmaWVyIGlzIH4xMHggZmFzdGVyIHRoYW4gdGVyc2VyIHdpdGggbmVnbGlnaWJsZSBzaXplIGRpZmZcbiAgICBtaW5pZnk6IFwiZXNidWlsZFwiLFxuICAgIC8vIE5vIHNvdXJjZW1hcHMgaW4gcHJvZHVjdGlvbiBcdTIwMTQgc2hhdmVzIH4zMCUgb2ZmIGJ1bmRsZSB0cmFuc2ZlclxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgLy8gU3BsaXQgQ1NTIHBlciBjaHVuayBzbyByb3V0ZSBDU1MgaXMgb25seSBsb2FkZWQgd2hlbiBuZWVkZWRcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIC8vIENvcmUgUmVhY3QgcnVudGltZSBcdTIwMTQgbG9hZGVkIG9uIGV2ZXJ5IHBhZ2UsIGNhY2hlZCBhZ2dyZXNzaXZlbHlcbiAgICAgICAgICBcInZlbmRvci1yZWFjdFwiOiBbXCJyZWFjdFwiLCBcInJlYWN0LWRvbVwiLCBcInJlYWN0LXJvdXRlci1kb21cIl0sXG4gICAgICAgICAgLy8gRGF0YSBsYXllciBcdTIwMTQgc2VwYXJhdGUgZnJvbSBVSSBzbyBjYWNoZSBzdXJ2aXZlcyBjb21wb25lbnQgdXBkYXRlc1xuICAgICAgICAgIFwidmVuZG9yLXF1ZXJ5XCI6IFtcIkB0YW5zdGFjay9yZWFjdC1xdWVyeVwiXSxcbiAgICAgICAgICAvLyBBbmltYXRpb24gbGlicmFyeSBcdTIwMTQgbGFyZ2UgKH40MGtiIGd6KSwgb25seSBuZWVkZWQgb24gbWFya2V0aW5nIHBhZ2VzXG4gICAgICAgICAgXCJ2ZW5kb3ItbW90aW9uXCI6IFtcImZyYW1lci1tb3Rpb25cIl0sXG4gICAgICAgICAgLy8gQ2hhcnRzIFx1MjAxNCBvbmx5IHVzZWQgaW4gYWRtaW4vZGFzaGJvYXJkIHJvdXRlcywgbmV2ZXIgb24gcHVibGljIHBhZ2VzXG4gICAgICAgICAgXCJ2ZW5kb3ItY2hhcnRzXCI6IFtcInJlY2hhcnRzXCJdLFxuICAgICAgICAgIC8vIFN1cGFiYXNlIFx1MjAxNCBhdXRoICYgREIgY2xpZW50LCBvbmx5IG5lZWRlZCBwb3N0LWxvZ2luXG4gICAgICAgICAgXCJ2ZW5kb3Itc3VwYWJhc2VcIjogW1wiQHN1cGFiYXNlL3N1cGFiYXNlLWpzXCJdLFxuICAgICAgICAgIC8vIFJhZGl4IFVJIHByaW1pdGl2ZXMgXHUyMDE0IHNoYXJlZCBhY3Jvc3MgbWFueSBjb21wb25lbnRzLCBzdGFibGUgY2FjaGVcbiAgICAgICAgICBcInZlbmRvci1yYWRpeFwiOiBbXG4gICAgICAgICAgICBcIkByYWRpeC11aS9yZWFjdC1kaWFsb2dcIixcbiAgICAgICAgICAgIFwiQHJhZGl4LXVpL3JlYWN0LWRyb3Bkb3duLW1lbnVcIixcbiAgICAgICAgICAgIFwiQHJhZGl4LXVpL3JlYWN0LXRvb2x0aXBcIixcbiAgICAgICAgICAgIFwiQHJhZGl4LXVpL3JlYWN0LXRhYnNcIixcbiAgICAgICAgICAgIFwiQHJhZGl4LXVpL3JlYWN0LXNlbGVjdFwiLFxuICAgICAgICAgICAgXCJAcmFkaXgtdWkvcmVhY3QtcG9wb3ZlclwiLFxuICAgICAgICAgICAgXCJAcmFkaXgtdWkvcmVhY3QtdG9hc3RcIixcbiAgICAgICAgICAgIFwiQHJhZGl4LXVpL3JlYWN0LWFjY29yZGlvblwiLFxuICAgICAgICAgICAgXCJAcmFkaXgtdWkvcmVhY3QtY2hlY2tib3hcIixcbiAgICAgICAgICAgIFwiQHJhZGl4LXVpL3JlYWN0LWxhYmVsXCIsXG4gICAgICAgICAgICBcIkByYWRpeC11aS9yZWFjdC1zZXBhcmF0b3JcIixcbiAgICAgICAgICAgIFwiQHJhZGl4LXVpL3JlYWN0LXNsb3RcIixcbiAgICAgICAgICAgIFwiQHJhZGl4LXVpL3JlYWN0LXN3aXRjaFwiLFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWdULFNBQVMsb0JBQW9CO0FBQzdVLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7QUFIaEMsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixLQUFLLEVBQUUsU0FBUyxNQUFNO0FBQUEsRUFDeEI7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFNBQVMsaUJBQWlCLGdCQUFnQjtBQUFBLEVBQzVDLEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTyxFQUFFLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU8sRUFBRTtBQUFBLEVBQ2pEO0FBQUEsRUFDQSxPQUFPO0FBQUE7QUFBQSxJQUVMLFFBQVE7QUFBQTtBQUFBLElBRVIsUUFBUTtBQUFBO0FBQUEsSUFFUixXQUFXO0FBQUE7QUFBQSxJQUVYLGNBQWM7QUFBQSxJQUNkLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLGNBQWM7QUFBQTtBQUFBLFVBRVosZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBO0FBQUEsVUFFekQsZ0JBQWdCLENBQUMsdUJBQXVCO0FBQUE7QUFBQSxVQUV4QyxpQkFBaUIsQ0FBQyxlQUFlO0FBQUE7QUFBQSxVQUVqQyxpQkFBaUIsQ0FBQyxVQUFVO0FBQUE7QUFBQSxVQUU1QixtQkFBbUIsQ0FBQyx1QkFBdUI7QUFBQTtBQUFBLFVBRTNDLGdCQUFnQjtBQUFBLFlBQ2Q7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxZQUNBO0FBQUEsWUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
