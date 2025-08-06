// src/pages/Index.tsx
// Updated for page-based story system with background generation

import { useState, useEffect } from "react";
import { BookHeader } from "@/components/BookHeader";
import { MagicalLoader } from "@/components/MagicalLoader";
import { apiService, type Chapter, type PageResponse } from "@/lib/apiService";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentContent, setCurrentContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [connectionError, setConnectionError] = useState(false);
  const [nextPageReady, setNextPageReady] = useState(false);
  
  // Typewriter effect state
  const [visibleContent, setVisibleContent] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { toast } = useToast();

  // Initialize the app with page-based system
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        setConnectionError(false);
        
        // Initialize story from API
        const firstChapter = await apiService.initializeStory();
        
        setCurrentContent(firstChapter.content);
        setCurrentChapter(firstChapter.id);
        setCurrentPage(apiService.getCurrentPage());
        setTotalPages(apiService.getTotalPages());
        setIsLoading(false);
        
        toast({
          title: "Welcome to Spelltale!",
          description: "Your infinite AI-generated story begins now...",
        });
      } catch (error) {
        console.error("Failed to initialize app:", error);
        setConnectionError(true);
        setIsLoading(false);
        
        toast({
          title: "Connection Error",
          description: "Unable to connect to story service. Please check your connection and try again.",
          variant: "destructive",
        });
      }
    };

    initializeApp();
  }, [toast]);

  // Typewriter effect
  useEffect(() => {
    if (currentContent.length > 0) {
      const timer = setInterval(() => {
        if (currentIndex < currentContent.length) {
          setVisibleContent(currentContent.substring(0, currentIndex + 1));
          setCurrentIndex(prev => prev + 1);
        } else {
          clearInterval(timer);
        }
      }, 20);

      return () => clearInterval(timer);
    }
  }, [currentContent, currentIndex]);

  // Reset typewriter when content changes
  useEffect(() => {
    setCurrentIndex(0);
    setVisibleContent("");
  }, [currentContent]);

  // Auto-generate next page when reading is likely finished
  useEffect(() => {
    if (visibleContent.length === currentContent.length && currentContent.length > 0 && !isGenerating) {
      const timer = setTimeout(() => {
        handleNextPage();
      }, 4000); // Auto-advance after 4 seconds
      
      return () => clearTimeout(timer);
    }
  }, [visibleContent.length, currentContent.length, isGenerating]);

  const handleNextPage = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const nextPageNum = currentPage + 1;
      console.log(`📖 Moving to page ${nextPageNum}`);
      
      const pageData = await apiService.getPage(nextPageNum);
      
      setCurrentContent(pageData.content);
      setCurrentPage(pageData.page_number);
      setCurrentChapter(pageData.chapter_id);
      setNextPageReady(pageData.next_page_ready);
      
      // Update story state
      await apiService.loadStoryState();
      setTotalPages(apiService.getTotalPages());
      
    } catch (error) {
      console.error("Failed to get next page:", error);
      toast({
        title: "Loading Error",
        description: "Failed to load the next page. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreviousPage = async () => {
    if (currentPage <= 1) return;
    
    const prevPageNum = currentPage - 1;
    console.log(`📖 Moving to page ${prevPageNum}`);
    
    try {
      const pageData = await apiService.getPage(prevPageNum);
      
      setCurrentContent(pageData.content);
      setCurrentPage(pageData.page_number);
      setCurrentChapter(pageData.chapter_id);
      setNextPageReady(pageData.next_page_ready);
      
    } catch (error) {
      console.error("Failed to get previous page:", error);
      toast({
        title: "Loading Error",
        description: "Failed to load the previous page.",
        variant: "destructive",
      });
    }
  };

  const handleNewChapter = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const newChapter = await apiService.generateNewChapter();
      
      setCurrentContent(newChapter.content);
      setCurrentChapter(newChapter.id);
      setCurrentPage(1);
      setNextPageReady(false);
      
      // Update totals
      await apiService.loadStoryState();
      setTotalPages(apiService.getTotalPages());
      
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

  const retryConnection = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <MagicalLoader />;
  }

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-book">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <div className="text-6xl">📚</div>
          <h1 className="text-2xl font-bold text-mystical">Connection Lost</h1>
          <p className="text-muted-foreground">
            Unable to connect to the story service. Please check your internet connection and try again.
          </p>
          <button
            onClick={retryConnection}
            className="btn-mystical text-primary-foreground px-6 py-3 rounded-full shadow-book hover:shadow-mystical transition-all duration-300"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-book">
      <BookHeader
        onMenuClick={() => {}} // Simplified for now
        currentChapter={currentChapter}
        title="Spelltale"
      />
      
      {/* Main Reading Area */}
      <div className="min-h-screen pt-20 pb-8">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-gradient-to-br from-parchment via-parchment/95 to-parchment/90 rounded-lg shadow-book p-8 relative overflow-hidden">
            {/* Page decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-mystical opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-mystical opacity-30"></div>
            
            {/* Page number and info */}
            <div className="absolute top-4 right-6 text-sm text-mystical/60 font-serif">
              <div>Page {currentPage}</div>
              <div className="text-xs mt-1">Chapter {currentChapter}</div>
              {totalPages > 0 && (
                <div className="text-xs">{totalPages} pages total</div>
              )}
            </div>

            {/* Content */}
            <div className="prose prose-lg prose-slate max-w-none">
              <div className="text-ink-dark leading-relaxed text-justify font-serif whitespace-pre-wrap" style={{ color: 'hsl(220, 30%, 12%)' }}>
                {visibleContent}
                {currentIndex < currentContent.length && (
                  <span className="animate-pulse text-mystical">|</span>
                )}
              </div>
              
              {isGenerating && (
                <div className="flex items-center justify-center mt-8 p-4">
                  <div className="flex items-center space-x-3 text-mystical">
                    <Sparkles className="h-5 w-5 animate-magical-glow" />
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-medium animate-text-shimmer bg-gradient-mystical bg-clip-text text-transparent bg-[length:200%_100%]">
                      Weaving the next page...
                    </span>
                  </div>
                </div>
              )}

              {/* Page Navigation */}
              {!isGenerating && visibleContent.length === currentContent.length && (
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-mystical/20">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1}
                    className="text-mystical hover:bg-mystical/10"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous Page
                  </Button>

                  <div className="text-center">
                    <Button
                      onClick={handleNextPage}
                      disabled={isGenerating}
                      className="btn-mystical text-primary-foreground px-4 py-2 text-sm"
                    >
                      {nextPageReady ? "Next Page" : "Continue Story"}
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleNextPage}
                    className="text-mystical hover:bg-mystical/10"
                  >
                    Next Page
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
      
      {/* Floating action for new chapter */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={handleNewChapter}
          disabled={isGenerating}
          className="btn-mystical text-primary-foreground px-6 py-3 rounded-full shadow-book hover:shadow-mystical transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={isGenerating ? "Generating new chapter" : "Generate new chapter"}
        >
          {isGenerating ? "Weaving..." : "New Chapter"}
        </button>
      </div>

      {/* Debug info (development only) */}
      {import.meta.env?.MODE === 'development' && (
        <div className="fixed bottom-4 left-4 bg-card/80 backdrop-blur-sm p-3 rounded-lg text-xs text-muted-foreground">
          <div>User ID: {apiService.getUserId()}</div>
          <div>API: {apiService.getApiUrl()}</div>
          <div>Page: {currentPage} | Chapter: {currentChapter}</div>
          <div>Next Ready: {nextPageReady ? "Yes" : "No"}</div>
        </div>
      )}
    </div>
  );
};

export default Index;