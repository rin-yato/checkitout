import { defineConfig } from "vite";

// @ts-ignore
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
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
