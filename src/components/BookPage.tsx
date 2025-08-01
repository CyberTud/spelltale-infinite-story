import { useState, useEffect } from "react";
import { Loader2, Sparkles } from "lucide-react";

interface BookPageProps {
  content: string;
  isGenerating: boolean;
  onNeedMoreContent: () => void;
  pageNumber: number;
}

export const BookPage = ({ content, isGenerating, onNeedMoreContent, pageNumber }: BookPageProps) => {
  const [visibleContent, setVisibleContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (content.length > 0) {
      const timer = setInterval(() => {
        if (currentIndex < content.length) {
          setVisibleContent(content.substring(0, currentIndex + 1));
          setCurrentIndex(prev => prev + 1);
        } else {
          clearInterval(timer);
        }
      }, 20); // Typewriter effect speed

      return () => clearInterval(timer);
    }
  }, [content, currentIndex]);

  useEffect(() => {
    setCurrentIndex(0);
    setVisibleContent("");
  }, [content]);

  // Trigger more content when near the end
  useEffect(() => {
    if (visibleContent.length > content.length * 0.8 && !isGenerating) {
      onNeedMoreContent();
    }
  }, [visibleContent.length, content.length, isGenerating, onNeedMoreContent]);

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-gradient-to-br from-parchment via-parchment/95 to-parchment/90 rounded-lg shadow-book p-8 relative overflow-hidden">
          {/* Page decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-mystical opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-mystical opacity-30"></div>
          
          {/* Page number */}
          <div className="absolute top-4 right-6 text-sm text-mystical/60 font-serif">
            {pageNumber}
          </div>

          {/* Content */}
          <div className="prose prose-lg prose-slate max-w-none">
            <div className="text-ink-dark leading-relaxed text-justify font-serif whitespace-pre-wrap" style={{ color: 'hsl(220, 30%, 12%)' }}>
              {visibleContent}
              {currentIndex < content.length && (
                <span className="animate-pulse text-mystical">|</span>
              )}
            </div>
            
            {isGenerating && (
              <div className="flex items-center justify-center mt-8 p-4">
                <div className="flex items-center space-x-3 text-mystical">
                  <Sparkles className="h-5 w-5 animate-magical-glow" />
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-medium animate-text-shimmer bg-gradient-mystical bg-clip-text text-transparent bg-[length:200%_100%]">
                    The tale continues to weave itself...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Magical border effects */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-mystical/10 via-transparent to-golden/10 pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};