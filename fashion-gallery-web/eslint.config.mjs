import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Utility scripts that use CommonJS require()
    "scripts/**",
    "deploy-rules.js",
  ]),
  {
    rules: {
      // Downgrade to warnings — these don't cause runtime failures
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@next/next/no-img-element": "warn",
      "react/no-unescaped-entities": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "prefer-const": "warn",
      // Keep as errors — these are real issues
      "@next/next/no-html-link-for-pages": "error",
      "react-hooks/immutability": "error",
    },
  },
]);

export default eslintConfig;
