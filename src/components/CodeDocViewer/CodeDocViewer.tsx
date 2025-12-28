import { BlogEntry } from "@/types/blog";
import { Calendar, Tag } from "lucide-react";

interface CodeDocViewerProps {
  entry: BlogEntry;
  header?: React.ReactNode; // custom header component
  footer?: React.ReactNode; // custom footer component
  showMeta?: boolean; // meta information (date, tags)
  classNames?: string;
}

export function CodeDocViewer({
  entry,
  header,
  footer,
  showMeta = true,
  classNames,
}: CodeDocViewerProps) {
  return (
    <article className={`min-h-screen ${classNames}`}>
      {header ?? (
        <header className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left header - dark */}
          <div className="bg-code-bg p-6 lg:p-10 flex items-end">
            <div className="text-code-fg/60 text-sm font-mono">
              {showMeta && entry.meta?.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <time>{entry.meta.date}</time>
                </div>
              )}
            </div>
          </div>

          {/* Right header - light */}
          <div className="bg-background p-6 lg:p-10 lg:pl-12">
            <h1 className="text-4xl lg:text-5xl font-serif font-semibold text-content-heading tracking-tight leading-tight mb-4">
              {entry.title}
            </h1>
            {showMeta && entry.meta?.tags && (
              <div className="flex flex-wrap gap-2">
                {entry.meta.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>
      )}

      {/* Todo: implement the sections logic */}

      {footer ?? (
        <footer className="grid grid-cols-1 lg:grid-cols-2">
          <div className="bg-code-bg p-6 lg:p-10">
            <p className="text-code-fg/40 text-sm font-mono">End of document</p>
          </div>
          <div className="bg-background p-6 lg:p-10 lg:pl-12">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />
              <span className="text-muted-foreground text-sm">✦</span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>
        </footer>
      )}
    </article>
  );
}
