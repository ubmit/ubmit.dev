// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import { getCollection, type CollectionEntry } from "astro:content";

export const SITE_TITLE = "Guilherme de Andrade";
export const SITE_DESCRIPTION =
  "Guilherme de Andrade (@ubmit). Building user-first products and exploring agentic engineering.";

export const postsSortedByPubDate = (await getCollection("blog")).sort(
  (a: CollectionEntry<"blog">, b: CollectionEntry<"blog">) =>
    b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
);
