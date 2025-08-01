import { Sparkles, BookOpen, Feather } from "lucide-react";

export const MagicalLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-book">
      <div className="text-center space-y-6">
        <div className="relative">
          <BookOpen className="h-16 w-16 text-mystical mx-auto animate-float" />
          <Sparkles className="h-6 w-6 text-golden absolute -top-2 -right-2 animate-magical-glow" />
          <Feather className="h-4 w-4 text-golden absolute -bottom-1 -left-1 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-mystical font-serif">
            Spelltale
          </h1>
          <p className="text-muted-foreground animate-text-shimmer bg-gradient-to-r from-mystical via-golden to-mystical bg-clip-text text-transparent bg-[length:200%_100%]">
            Weaving your infinite tale...
          </p>
        </div>
        
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-mystical rounded-full animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};