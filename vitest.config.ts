import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    include: ["src/**/*.test.ts"],
    env: {
      // Dummy — pure-function tests only; the client never connects.
      DATABASE_URL: "postgresql://user:pass@localhost:5432/webume",
    },
  },
});
