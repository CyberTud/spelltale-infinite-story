import { useState, useEffect } from "react";
import { BookHeader } from "@/components/BookHeader";
import { BookPage } from "@/components/BookPage";
import { ChapterMenu } from "@/components/ChapterMenu";
import { MagicalLoader } from "@/components/MagicalLoader";
import { storyGenerator, type Chapter } from "@/lib/storyGenerator";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentContent, setCurrentContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const { toast } = useToast();

  // Initialize the app
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Simulate initial loading
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const initialChapters = storyGenerator.getChapters();
        setChapters(initialChapters);
        setCurrentContent(initialChapters[0].content);
        setIsLoading(false);
        
        toast({
          title: "Welcome to Spelltale!",
          description: "Your infinite AI-generated story begins now...",
        });
      } catch (error) {
        console.error("Failed to initialize app:", error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [toast]);

  const generateMoreContent = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const newContent = await storyGenerator.generateNextPart();
      setCurrentContent(prev => prev + "\n\n" + newContent);
      setPageNumber(prev => prev + 1);
    } catch (error) {
      console.error("Failed to generate content:", error);
      toast({
        title: "Generation Error",
        description: "Failed to generate more content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateNewChapter = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const newChapter = await storyGenerator.generateNewChapter();
      setChapters(prev => [...prev, newChapter]);
      setCurrentChapter(newChapter.id);
      setCurrentContent(newChapter.content);
      setPageNumber(1);
      
      toast({
        title: "New Chapter Created!",
        description: `Chapter ${newChapter.id}: ${newChapter.title}`,
      });
    } catch (error) {
      console.error("Failed to generate chapter:", error);
      toast({
        title: "Generation Error",
        description: "Failed to generate new chapter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChapterSelect = (chapterId: number) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (chapter) {
      setCurrentChapter(chapterId);
      setCurrentContent(chapter.content);
      setPageNumber(1);
    }
  };

  if (isLoading) {
    return <MagicalLoader />;
  }

  const currentChapterData = chapters.find(c => c.id === currentChapter);

  return (
    <div className="min-h-screen bg-gradient-book">
      <BookHeader
        onMenuClick={() => setIsMenuOpen(true)}
        currentChapter={currentChapter}
        title="Spelltale"
      />
      
      <ChapterMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        chapters={chapters}
        currentChapter={currentChapter}
        onChapterSelect={handleChapterSelect}
      />
      
      <BookPage
        content={currentContent}
        isGenerating={isGenerating}
        onNeedMoreContent={generateMoreContent}
        pageNumber={pageNumber}
      />
      
      {/* Floating action for new chapter */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={generateNewChapter}
          disabled={isGenerating}
          className="btn-mystical text-primary-foreground px-6 py-3 rounded-full shadow-book hover:shadow-mystical transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isGenerating ? "Generating new chapter" : "Generate new chapter"}
        >
          {isGenerating ? "Weaving..." : "New Chapter"}
        </button>
      </div>
    </div>
  );
};

export default Index;
