export interface Post {
  content: string;
  date: string;
  slug: string;
  title: string;
}

export const posts: Array<Post> = [
  {
    content:
      "This is my first blog post. Welcome to my personal website! I am excited to share my thoughts, projects, and ideas here.",
    date: "2025-01-15",
    slug: "hello-world",
    title: "Hello World",
  },
  {
    content:
      "I wanted a simple, fast personal website that I fully control. No bloated CMS, no tracking, just clean HTML and my own words.",
    date: "2025-02-01",
    slug: "why-i-built-this",
    title: "Why I Built This",
  },
  {
    content: "Your post content here...",
    date: "2025-05-01",
    slug: "my-new-post",
    title: "My New Post",
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getAllPosts(): Array<Post> {
  return [...posts].toSorted((a, b) => b.date.localeCompare(a.date));
}
