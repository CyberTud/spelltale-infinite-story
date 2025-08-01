import { BookOpen, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Chapter {
  id: number;
  title: string;
  wordCount: number;
  timeRead: string;
}

interface ChapterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  currentChapter: number;
  onChapterSelect: (chapterId: number) => void;
}

export const ChapterMenu = ({ 
  isOpen, 
  onClose, 
  chapters, 
  currentChapter, 
  onChapterSelect 
}: ChapterMenuProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80 bg-card border-border">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2 text-mystical">
            <BookOpen className="h-5 w-5" />
            <span>Spelltale Chapters</span>
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-3">
          {chapters.map((chapter) => (
            <Button
              key={chapter.id}
              variant={chapter.id === currentChapter ? "default" : "ghost"}
              className={`w-full justify-start p-4 h-auto ${
                chapter.id === currentChapter 
                  ? "btn-mystical text-primary-foreground" 
                  : "hover:bg-mystical/10 text-foreground"
              }`}
              onClick={() => {
                onChapterSelect(chapter.id);
                onClose();
              }}
            >
              <div className="flex flex-col items-start space-y-2 w-full">
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold">Chapter {chapter.id}</span>
                  {chapter.id === currentChapter && (
                    <Sparkles className="h-4 w-4 animate-magical-glow" />
                  )}
                </div>
                <h3 className="text-sm font-medium text-left line-clamp-2">
                  {chapter.title}
                </h3>
                <div className="flex items-center space-x-4 text-xs opacity-70">
                  <div className="flex items-center space-x-1">
                    <BookOpen className="h-3 w-3" />
                    <span>{chapter.wordCount} words</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{chapter.timeRead}</span>
                  </div>
                </div>
              </div>
            </Button>
          ))}
          
          <div className="pt-4 border-t border-border">
            <div className="text-center text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 inline mr-1 animate-magical-glow" />
              New chapters generate as you read
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};