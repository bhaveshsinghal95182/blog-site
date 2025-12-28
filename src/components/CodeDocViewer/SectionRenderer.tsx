import { Section } from "@/types/blog";

interface SectionRendererProps {
  section: Section;
  isFirst?: boolean;
  isLast?: boolean;
}

export function SectionRenderer({
  section,
  isFirst,
  isLast,
}: SectionRendererProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-fit">
      {/* Code */}
      <div className="">
        {section.codeBlocks?.map((codeBlock, index) => (
          <pre>
            <code>{codeBlock.filePath}</code>
          </pre>
        ))}
      </div>

      {/* Content */}
      <div>
        {section.heading && <h2>{section.heading}</h2>}
        {section.content && (
          <div>
            {/* Render markdown content here */}
            {section.content}
          </div>
        )}
      </div>
    </div>
  );
}
