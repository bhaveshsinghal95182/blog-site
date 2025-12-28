import { CodeDocViewer } from "@/components/CodeDocViewer";
import { getBlogById, getAllBlogIds } from "@/data/blogs";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * SSG: Generate static pages for all blogs at build time
 * This runs at build time and creates a static HTML page for each blog
 */
export async function generateStaticParams() {
  const blogIds = getAllBlogIds();
  
  return blogIds.map((id) => ({
    slug: id,
  }));
}

/**
 * Generate metadata for each blog (SEO)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogById(slug);
  
  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.sections[0]?.content?.slice(0, 160),
    keywords: blog.meta?.tags,
    openGraph: {
      title: blog.title,
      type: "article",
      publishedTime: blog.meta?.date,
      tags: blog.meta?.tags,
    },
  };
}

/**
 * Blog post page - statically generated at build time
 */
export default async function BlogPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = getBlogById(slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <CodeDocViewer entry={blog} />
    </main>
  );
}
