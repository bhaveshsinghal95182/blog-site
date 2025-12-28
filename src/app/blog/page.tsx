import { CodeDocViewer } from "@/components/CodeDocViewer";
import { vectorsBlogEntry } from "@/data/vectorData";

export default function Page() {
  return (
    <main className="min-h-screen">
      <CodeDocViewer entry={vectorsBlogEntry} />
    </main>
  );
}
