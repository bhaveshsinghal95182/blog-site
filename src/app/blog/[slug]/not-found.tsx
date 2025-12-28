import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BlogNotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center px-6">
        <h1 className="text-6xl font-serif font-bold text-content-heading mb-4">
          404
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          This blog post doesn't exist.
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>
    </main>
  );
}
