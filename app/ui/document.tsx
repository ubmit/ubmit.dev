import type { RemixNode } from "remix/ui";

import { routes } from "../routes.ts";

export interface DocumentProps {
  children?: RemixNode;
  title?: string;
}

const DEFAULT_TITLE = decodeURIComponent("Ubmit.dev");

export function Document() {
  return ({ children, title = DEFAULT_TITLE }: DocumentProps) => (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <title>{title}</title>
      </head>
      <body>
        {children}
        <script src={routes.assets.href({ path: "app/assets/entry.ts" })} type="module"></script>
      </body>
    </html>
  );
}
