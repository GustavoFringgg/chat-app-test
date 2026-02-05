import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";

export default [
  {
    files: ["src/**/*.ts", "src/**/*.vue"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      // 基本規則
      "no-console": "warn", // console.log 會警告
      "no-unused-vars": "off", // 關閉 JS 版本
      "@typescript-eslint/no-unused-vars": "warn", // 使用 TS 版本
    },
  },
];
