import type { RemixNode } from "remix/ui";

import { routes } from "../routes.ts";
import { Document } from "./document.tsx";

export interface LayoutProps {
  children?: RemixNode;
  title?: string;
}

export function Layout() {
  return ({ children, title }: LayoutProps) => (
    <Document title={title}>
      <header>
        <nav>
          <a href={routes.home.href()}>Home</a> <a href={routes.writing.index.href()}>Writing</a>
        </nav>
      </header>
      <main>{children}</main>
    </Document>
  );
}
