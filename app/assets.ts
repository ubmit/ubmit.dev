import { createAssetServer } from "remix/assets";

export const assets = createAssetServer({
  allow: ["app/assets/**", "app/ui/prompt-button.tsx", "node_modules/**"],
  basePath: "/assets",
  deny: ["app/**/*.server.*"],
  fileMap: {
    "app/*path": "app/*path",
    "node_modules/*path": "node_modules/*path",
  },
  rootDir: process.cwd(),
  scripts: {
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
    },
  },
  sourceMaps: process.env.NODE_ENV === "development" ? "external" : undefined,
});
