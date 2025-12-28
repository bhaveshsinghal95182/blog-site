import { BlogEntry } from "@/types/blog";
import { vectorsBlogEntry } from "./vectors";

// Add new blog imports here
// import { anotherBlogEntry } from "./another-blog";

/**
 * All blog entries - add new blogs to this array
 */
export const allBlogs: BlogEntry[] = [
  vectorsBlogEntry,
  // anotherBlogEntry,
];

/**
 * Get a blog by its ID
 */
export function getBlogById(id: string): BlogEntry | undefined {
  return allBlogs.find((blog) => blog.id === id);
}

/**
 * Get all blog IDs (useful for static generation)
 */
export function getAllBlogIds(): string[] {
  return allBlogs.map((blog) => blog.id);
}

/**
 * Get blog metadata for listing pages
 */
export function getBlogList() {
  return allBlogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    meta: blog.meta,
  }));
}

// Re-export for backward compatibility
export { vectorsBlogEntry };
