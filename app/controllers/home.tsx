import type { BuildAction } from "remix/fetch-router";

import type { routes } from "../routes.ts";
import { Layout } from "../ui/layout.tsx";
import { render } from "../utils/render.tsx";

export const home: BuildAction<"GET", typeof routes.home> = {
  handler({ request }) {
    return render(
      <Layout title="gui de andrade">
        <HomePage />
      </Layout>,
      request,
    );
  },
};

function HomePage() {
  return () => (
    <div>
      <h1>gui de andrade</h1>
      <div>design engineer</div>
    </div>
  );
}
