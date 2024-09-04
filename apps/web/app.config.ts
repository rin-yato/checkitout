import { defineConfig } from "@tanstack/start/config";

export default defineConfig({
  tsr: {
    appDirectory: "./app",
    routesDirectory: "./app/route",
    generatedRouteTree: "./app/route.gen.ts",
  },
});
