import type { Controller } from "remix/fetch-router";

import { getAllPosts, getPostBySlug } from "../../data/posts.ts";
import { routes } from "../../routes.ts";
import { Layout } from "../../ui/layout.tsx";
import { render } from "../../utils/render.tsx";

export default {
  actions: {
    async index({ request }) {
      let posts = getAllPosts();
      return render(
        <Layout title="writing">
          <WritingIndexPage posts={posts} />
        </Layout>,
        request,
      );
    },

    async show({ request, params }) {
      let post = getPostBySlug(params.slug);
      if (!post) {
        return new Response("Not Found", { status: 404 });
      }
      return render(
        <Layout title={post.title}>
          <WritingShowPage post={post} />
        </Layout>,
        request,
      );
    },
  },
} satisfies Controller<typeof routes.writing>;

function WritingIndexPage() {
  return ({ posts }: { posts: ReturnType<typeof getAllPosts> }) => (
    <div>
      <h1>Writing</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <a href={routes.writing.show.href({ slug: post.slug })}>
              {post.title}
            </a>
            {" — "}
            <time>{post.date}</time>
          </li>
        ))}
      </ul>
    </div>
  );
}

function WritingShowPage() {
  return ({
    post,
  }: {
    post: NonNullable<ReturnType<typeof getPostBySlug>>;
  }) => (
    <article>
      <h1>{post.title}</h1>
      <time>{post.date}</time>
      <p>{post.content}</p>
    </article>
  );
}
