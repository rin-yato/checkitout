// vite.config.ts
import { defineConfig } from "file:///Users/rinyato/Desktop/projects/miracles/checkitout/node_modules/.pnpm/vite@5.4.3/node_modules/vite/dist/node/index.js";
import { TanStackRouterVite } from "file:///Users/rinyato/Desktop/projects/miracles/checkitout/node_modules/.pnpm/@tanstack+router-plugin@1.56.1_vite@5.4.3/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
import react from "file:///Users/rinyato/Desktop/projects/miracles/checkitout/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.0_vite@5.4.3/node_modules/@vitejs/plugin-react-swc/index.mjs";
import tsconfigPaths from "file:///Users/rinyato/Desktop/projects/miracles/checkitout/node_modules/.pnpm/vite-tsconfig-paths@5.0.1_typescript@5.5.4_vite@5.4.3/node_modules/vite-tsconfig-paths/dist/index.js";
const vite_config_default = defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: "src/route",
      generatedRouteTree: "src/route.gen.ts",
      autoCodeSplitting: true,
    }),
    react(),
    tsconfigPaths(),
  ],
});
export { vite_config_default as default };
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcmlueWF0by9EZXNrdG9wL3Byb2plY3RzL21pcmFjbGVzL2NoZWNraXRvdXQvYXBwcy93ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9yaW55YXRvL0Rlc2t0b3AvcHJvamVjdHMvbWlyYWNsZXMvY2hlY2tpdG91dC9hcHBzL3dlYi92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcmlueWF0by9EZXNrdG9wL3Byb2plY3RzL21pcmFjbGVzL2NoZWNraXRvdXQvYXBwcy93ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuXG4vLyBAdHMtaWdub3JlXG5pbXBvcnQgeyBUYW5TdGFja1JvdXRlclZpdGUgfSBmcm9tIFwiQHRhbnN0YWNrL3JvdXRlci1wbHVnaW4vdml0ZVwiO1xuXG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHRzY29uZmlnUGF0aHMgZnJvbSBcInZpdGUtdHNjb25maWctcGF0aHNcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICBUYW5TdGFja1JvdXRlclZpdGUoe1xuICAgICAgcm91dGVzRGlyZWN0b3J5OiBcInNyYy9yb3V0ZVwiLFxuICAgICAgZ2VuZXJhdGVkUm91dGVUcmVlOiBcInNyYy9yb3V0ZS5nZW4udHNcIixcbiAgICAgIGF1dG9Db2RlU3BsaXR0aW5nOiB0cnVlLFxuICAgIH0pLFxuICAgIHJlYWN0KCksXG4gICAgdHNjb25maWdQYXRocygpLFxuICBdLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNXLFNBQVMsb0JBQW9CO0FBR25ZLFNBQVMsMEJBQTBCO0FBRW5DLE9BQU8sV0FBVztBQUNsQixPQUFPLG1CQUFtQjtBQUcxQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxtQkFBbUI7QUFBQSxNQUNqQixpQkFBaUI7QUFBQSxNQUNqQixvQkFBb0I7QUFBQSxNQUNwQixtQkFBbUI7QUFBQSxJQUNyQixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsRUFDaEI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
