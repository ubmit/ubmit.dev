import nkzw from "@nkzw/oxlint-config";
import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [nkzw],
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
});
