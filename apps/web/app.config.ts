import { defineConfig } from "@tanstack/start/config";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  tsr: {
    appDirectory: "./app",
    routesDirectory: "./app/route",
    generatedRouteTree: "./app/route.gen.ts",
    autoCodeSplitting: true,
  },
  vite: {
    plugins: () => [tsConfigPaths()],
  },
  routers: { ssr: { entry: "./app/ssr.tsx" }, client: { entry: "./app/client.tsx" } },
});
