import nkzw from "@nkzw/oxlint-config";
import { defineConfig } from "vite-plus";

export default defineConfig({
  fmt: {
    ignorePatterns: ["node_modules", "build", "dist", "public/build"],
  },
  lint: {
    extends: [nkzw],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    overrides: [
      {
        files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
        rules: {
          "react-in-jsx-scope": "off",
          "react/display-name": "off",
        },
      },
      {
        files: ["server.ts", "app/**/*.tsx"],
        rules: {
          "no-console": "off",
        },
      },
    ],
  },
  staged: {
    "*": "vp check --fix",
  },
});
