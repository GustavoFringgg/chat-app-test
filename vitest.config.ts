import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: "happy-dom", // 模擬瀏覽器環境
    globals: true, // 可以直接使用 describe, it, expect
  },
});
