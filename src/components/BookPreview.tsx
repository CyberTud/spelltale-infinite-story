import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface BookPreviewProps {
  content?: string;
}

const defaultExcerpt = `The candlelight shivered as if something unseen had passed by. In the hush that followed, a line of runes glowed along the book’s margin—letters arranging themselves into a sentence that had never existed before...`;

export const BookPreview = ({ content = defaultExcerpt }: BookPreviewProps) => {
  const [visible, setVisible] = useState("");
  const [i, setI] = useState(0);

  useEffect(() => {
    setVisible("");
    setI(0);
  }, [content]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (i < content.length) {
        setVisible(content.slice(0, i + 1));
        setI((v) => v + 1);
      } else {
        clearInterval(timer);
      }
    }, 18);
    return () => clearInterval(timer);
  }, [i, content]);

  return (
    <div className="rounded-lg border border-border bg-card/70 shadow-book overflow-hidden">
      <div className="relative p-6">
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-mystical opacity-40" />
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-mystical opacity-40" />
        <div className="mb-3 flex items-center gap-2 text-mystical">
          <Sparkles className="h-4 w-4 animate-magical-glow" aria-hidden="true" />
          <span className="text-xs font-medium">Live preview</span>
        </div>
        <p className="font-serif leading-relaxed text-ink-dark/95 whitespace-pre-wrap">
          {visible}
          {i < content.length && <span className="animate-pulse text-mystical">|</span>}
        </p>
      </div>
    </div>
  );
};
