// src/components/BookPage.tsx
// Enhanced version with scene navigation

import { useState, useEffect } from "react";
import { Loader2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookPageProps {
  content: string;
  isGenerating: boolean;
  onNeedMoreContent: () => void;
  pageNumber: number;
  scenes?: string[]; // Array of all scenes in current chapter
  currentSceneIndex?: number;
  onSceneChange?: (sceneIndex: number) => void;
}

export const BookPage = ({ 
  content, 
  isGenerating, 
  onNeedMoreContent, 
  pageNumber,
  scenes = [],
  currentSceneIndex = 0,
  onSceneChange
}: BookPageProps) => {
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

  // Trigger more content when near the end and fully typed
  useEffect(() => {
    if (visibleContent.length === content.length && content.length > 0 && !isGenerating) {
      // Auto-generate after a short delay when reading is likely finished
      const timer = setTimeout(() => {
        onNeedMoreContent();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [visibleContent.length, content.length, isGenerating, onNeedMoreContent]);

  const handlePreviousScene = () => {
    if (onSceneChange && currentSceneIndex > 0) {
      onSceneChange(currentSceneIndex - 1);
    }
  };

  const handleNextScene = () => {
    if (onSceneChange && currentSceneIndex < scenes.length - 1) {
      onSceneChange(currentSceneIndex + 1);
    } else {
      // Generate new scene if at the end
      onNeedMoreContent();
    }
  };

  const canGoBack = scenes.length > 1 && currentSceneIndex > 0;
  const canGoForward = currentSceneIndex < scenes.length - 1;
  const isLastScene = currentSceneIndex === scenes.length - 1;

  return (
    <div className="min-h-screen pt-20 pb-8">
      <div className="max-w-2xl mx-auto px-6">
        <div className="bg-gradient-to-br from-parchment via-parchment/95 to-parchment/90 rounded-lg shadow-book p-8 relative overflow-hidden">
          {/* Page decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-mystical opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-mystical opacity-30"></div>
          
          {/* Page number and scene info */}
          <div className="absolute top-4 right-6 text-sm text-mystical/60 font-serif">
            Page {pageNumber}
            {scenes.length > 1 && (
              <div className="text-xs mt-1">
                Scene {currentSceneIndex + 1} of {scenes.length}
              </div>
            )}
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

            {/* Scene Navigation */}
            {!isGenerating && visibleContent.length === content.length && (
              <div className="flex items-center justify-between mt-8 pt-4 border-t border-mystical/20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousScene}
                  disabled={!canGoBack}
                  className="text-mystical hover:bg-mystical/10"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous Scene
                </Button>

                <div className="text-center">
                  {isLastScene && (
                    <Button
                      onClick={onNeedMoreContent}
                      disabled={isGenerating}
                      className="btn-mystical text-primary-foreground px-4 py-2 text-sm"
                    >
                      Continue Story
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextScene}
                  disabled={!canGoForward && isLastScene}
                  className="text-mystical hover:bg-mystical/10"
                >
                  {canGoForward ? "Next Scene" : "Generate Next"}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
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