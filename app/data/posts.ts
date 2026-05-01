export interface Post {
  slug: string;
  title: string;
  date: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: "hello-world",
    title: "Hello World",
    date: "2025-01-15",
    content:
      "This is my first blog post. Welcome to my personal website! I am excited to share my thoughts, projects, and ideas here.",
  },
  {
    slug: "why-i-built-this",
    title: "Why I Built This",
    date: "2025-02-01",
    content:
      "I wanted a simple, fast personal website that I fully control. No bloated CMS, no tracking, just clean HTML and my own words.",
  },
  {
    slug: "my-new-post",
    title: "My New Post",
    date: "2025-05-01",
    content: "Your post content here...",
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getAllPosts(): Post[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}
