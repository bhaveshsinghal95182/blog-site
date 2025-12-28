import { getBlogList } from "@/data/blogs";
import { Calendar, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Programming tutorials and guides",
};

/**
 * Blog listing page - statically generated at build time
 */
export default function BlogListPage() {
  const blogs = getBlogList();

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <header className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-serif font-semibold text-content-heading tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-muted-foreground text-lg">
            Programming tutorials, guides, and deep dives
          </p>
        </header>

        <div className="space-y-6">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.id}`}
              className="group block p-6 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/30 transition-all"
            >
              <article>
                <h2 className="text-xl font-semibold text-content-heading group-hover:text-primary transition-colors mb-3 flex items-center gap-2">
                  {blog.title}
                  <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {blog.meta?.date && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <time>{blog.meta.date}</time>
                    </span>
                  )}

                  {blog.meta?.tags && (
                    <div className="flex flex-wrap gap-2">
                      {blog.meta.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {blogs.length === 0 && (
          <p className="text-muted-foreground text-center py-12">
            No blog posts yet. Check back soon!
          </p>
        )}
      </div>
    </main>
  );
}
