import { Section } from "@/types/blog";
import { CodeRenderer } from "./CodeRenderer";

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
      <div className="bg-code-bg p-6 lg:p-10 order-2 lg:order-1">
        <div className="sticky top-8 space-y-6">
          {section.codeBlocks?.map((codeBlock, index) => (
            <CodeRenderer
              key={codeBlock.id}
              codeBlock={{
                ...codeBlock,
                isLast:
                  isLast && index === (section.codeBlocks?.length ?? 1) - 1,
              }}
              lineAnimationDelay={20}
            />
          ))}
        </div>
      </div>

      <div className="p-6 lg:p-10 order-1 lg:order-2">
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
