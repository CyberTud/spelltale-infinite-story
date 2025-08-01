import { BookOpen, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookHeaderProps {
  onMenuClick: () => void;
  currentChapter: number;
  title: string;
}

export const BookHeader = ({ onMenuClick, currentChapter, title }: BookHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-card/80 border-b border-border">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onMenuClick}
            className="text-mystical hover:bg-mystical/10"
            aria-label="Open chapter menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </Button>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-mystical animate-float" />
            <h1 className="text-xl font-bold text-mystical">{title}</h1>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-sm text-muted-foreground">
            Chapter {currentChapter}
          </div>
          <div className="flex items-center space-x-1 text-golden">
            <Sparkles className="h-4 w-4 animate-magical-glow" />
            <span className="text-xs font-medium">AI Writing</span>
          </div>
        </div>
      </div>
    </header>
  );
};