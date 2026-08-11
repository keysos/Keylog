import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwindV4 from "@bns2/eslint-plugin-tailwind-v4";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  tailwindV4.configs.recommended("./app/globals.css"),

  {
    rules: {
      "tailwind-v4/typo": "error",
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
