import ReactMarkdown from "react-markdown";

interface ContentRendererProps {
  content: string;
  heading?: string;
}

export function ContentRenderer({ content, heading }: ContentRendererProps) {
  return (
    <div className="prose prose-lg max-w-none">
      {heading && (
        <h2 className="text-3xl font-serif font-semibold text-content-heading mb-6 tracking-tight">
          {heading}
        </h2>
      )}
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="text-2xl font-serif font-semibold text-content-heading mt-8 mb-4 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-serif font-semibold text-content-heading mt-6 mb-3">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-content-text leading-relaxed mb-4 text-base">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-2 mb-6 pl-0">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="text-content-text flex items-start gap-3">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-2.5 shrink-0" />
              <span>{children}</span>
            </li>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-6 text-content-text">
              {children}
            </ol>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-content-heading">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-content-text">{children}</em>
          ),
          code: ({ children }) => (
            <code className="px-1.5 py-0.5 bg-secondary rounded text-sm font-mono text-primary">
              {children}
            </code>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-content-link hover:underline underline-offset-2"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
