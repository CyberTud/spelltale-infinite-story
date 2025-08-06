// src/lib/apiService.ts
// Complete page-based API service with background generation

interface PageResponse {
  page_number: number;
  content: string;
  chapter_id: number;
  is_generated: boolean;
  next_page_ready: boolean;
}

interface StoryState {
  user_id: string;
  current_chapter: number;
  current_page: number;
  total_pages: number;
  pages_generated: number;
}

interface Chapter {
  id: number;
  title: string;
  content: string;
  wordCount: number;
  timeRead: string;
}

interface StoryContext {
  genre: string;
  characters: string[];
  currentPlot: string;
  tone: string;
}

class ApiService {
  private baseUrl: string;
  private userId: string;
  private storyState: StoryState | null = null;
  private pageCache: Map<number, PageResponse> = new Map();
  private context: StoryContext;

  constructor() {
    this.baseUrl = this.determineApiUrl();
    this.userId = this.generateUserId();
    
    this.context = {
      genre: "Fantasy",
      characters: ["Lyra", "Master Theron", "The Shadow King"],
      currentPlot: "",
      tone: "mystical and adventurous"
    };

    console.log(`🔗 API Service initialized: ${this.baseUrl}`);
    console.log(`👤 User ID: ${this.userId}`);
  }

  private determineApiUrl(): string {
    if (import.meta.env?.VITE_API_URL) {
      return import.meta.env.VITE_API_URL;
    }
    
    if ((window as any).VITE_API_URL) {
      return (window as any).VITE_API_URL;
    }
    
    if ((window as any).REACT_APP_API_URL) {
      return (window as any).REACT_APP_API_URL;
    }
    
    return 'http://localhost:8000';
  }

  private generateUserId(): string {
    let userId = sessionStorage.getItem('spelltale_user_id');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      sessionStorage.setItem('spelltale_user_id', userId);
    }
    return userId;
  }

  async initializeStory(): Promise<Chapter> {
    try {
      console.log(`🚀 Initializing story from ${this.baseUrl}`);
      
      // Get story state
      await this.loadStoryState();
      
      // Get first page (or current page if returning user)
      const currentPage = this.storyState?.current_page || 1;
      const pageData = await this.getPage(currentPage);
      
      // Convert to Chapter format for compatibility
      const chapter = this.convertToChapter(pageData);
      
      console.log(`✨ Story initialized on page ${pageData.page_number}`);
      return chapter;
      
    } catch (error) {
      console.error('❌ Failed to initialize story:', error);
      return this.getFallbackChapter();
    }
  }

  async getPage(pageNumber: number): Promise<PageResponse> {
    try {
      // Check cache first
      if (this.pageCache.has(pageNumber)) {
        console.log(`📖 Retrieved page ${pageNumber} from cache`);
        return this.pageCache.get(pageNumber)!;
      }

      console.log(`🔄 Fetching page ${pageNumber} from server`);
      
      const response = await fetch(`${this.baseUrl}/page/${this.userId}/${pageNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const pageData: PageResponse = await response.json();
      
      // Cache the page
      this.pageCache.set(pageNumber, pageData);
      
      console.log(`📄 Page ${pageNumber} loaded (next ready: ${pageData.next_page_ready})`);
      
      // Preload next page if not ready
      if (!pageData.next_page_ready) {
        setTimeout(() => this.preloadNextPage(pageNumber), 1000);
      }
      
      return pageData;
      
    } catch (error) {
      console.error(`❌ Failed to get page ${pageNumber}:`, error);
      return this.getFallbackPageResponse(pageNumber);
    }
  }

  async generateNextPart(): Promise<string> {
    try {
      // Get current page number from story state
      const currentPage = this.storyState?.current_page || 1;
      const nextPage = currentPage + 1;
      
      console.log(`🎬 Getting next page ${nextPage}`);
      
      const pageData = await this.getPage(nextPage);
      return pageData.content;
      
    } catch (error) {
      console.error('❌ Failed to generate next part:', error);
      return this.getFallbackContinuation();
    }
  }

  async generateNewChapter(): Promise<Chapter> {
    try {
      console.log(`📚 Creating new chapter`);
      
      const response = await fetch(`${this.baseUrl}/chapter/new/${this.userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Create page response from chapter data
      const pageData: PageResponse = {
        page_number: data.page_number,
        content: data.content,
        chapter_id: data.chapter_id,
        is_generated: true,
        next_page_ready: false
      };
      
      // Clear cache and update state
      this.pageCache.clear();
      await this.loadStoryState();
      
      const chapter = this.convertToChapter(pageData);
      
      console.log(`📖 New chapter ${data.chapter_id} created`);
      
      return chapter;
      
    } catch (error) {
      console.error('❌ Failed to generate new chapter:', error);
      return this.getFallbackNewChapter();
    }
  }

  async loadStoryState(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/story/state/${this.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (response.ok) {
        this.storyState = await response.json();
        console.log(`📊 Story state loaded: Chapter ${this.storyState?.current_chapter}, Page ${this.storyState?.current_page}`);
      }
    } catch (error) {
      console.error('⚠️ Failed to load story state:', error);
    }
  }

  async getAllPages(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/pages/${this.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'cors',
      });

      if (response.ok) {
        return await response.json();
      }
      return { pages: [], total_pages: 0, chapters: {} };
    } catch (error) {
      console.error('⚠️ Failed to get all pages:', error);
      return { pages: [], total_pages: 0, chapters: {} };
    }
  }

  // Preload next page for smoother experience
  async preloadNextPage(currentPage: number): Promise<void> {
    const nextPage = currentPage + 1;
    
    if (!this.pageCache.has(nextPage)) {
      console.log(`🔄 Preloading page ${nextPage}`);
      try {
        await this.getPage(nextPage);
      } catch (error) {
        console.log(`⚠️ Preload failed for page ${nextPage}:`, error);
      }
    }
  }

  // Convert PageResponse to Chapter format for compatibility with existing components
  private convertToChapter(pageData: PageResponse): Chapter {
    const wordCount = this.countWords(pageData.content);
    return {
      id: pageData.chapter_id,
      title: pageData.chapter_id === 1 ? "The Beginning" : `Chapter ${pageData.chapter_id}`,
      content: pageData.content,
      wordCount: wordCount,
      timeRead: this.calculateReadTime(pageData.content)
    };
  }

  private getFallbackPageResponse(pageNumber: number): PageResponse {
    const fallbackContent = pageNumber === 1 
      ? "In the ancient kingdom of Aethermoor, where magic flowed through the very stones of the earth, a young apprentice discovered a peculiar book that seemed to write itself. As Lyra opened the leather-bound tome, golden letters began to appear on the parchment, telling her own story as it unfolded...\n\nThe book whispered secrets of forgotten spells and warned of a darkness stirring in the northern mountains."
      : `The magical journey continued as Lyra delved deeper into the mysteries of Aethermoor. Each turn of the page revealed new wonders and greater challenges that would test her courage and determination.`;
    
    return {
      page_number: pageNumber,
      content: fallbackContent,
      chapter_id: 1,
      is_generated: true,
      next_page_ready: false
    };
  }

  private getFallbackChapter(): Chapter {
    const fallbackContent = "In the ancient kingdom of Aethermoor, where magic flowed through the very stones of the earth, a young apprentice discovered a peculiar book that seemed to write itself. As Lyra opened the leather-bound tome, golden letters began to appear on the parchment, telling her own story as it unfolded...\n\nThe book whispered secrets of forgotten spells and warned of a darkness stirring in the northern mountains.";
    
    return {
      id: 1,
      title: "The Beginning",
      content: fallbackContent,
      wordCount: this.countWords(fallbackContent),
      timeRead: this.calculateReadTime(fallbackContent)
    };
  }

  private getFallbackContinuation(): string {
    return "The ancient magic that Lyra felt coursing through the tome began to respond to her touch. Symbols she had never seen before started to make sense, as if the knowledge was being written directly into her mind.";
  }

  private getFallbackNewChapter(): Chapter {
    const fallbackContent = "A new chapter in Lyra's journey began as she stepped through the mystical portal, leaving behind everything she had known...";
    
    return {
      id: 2,
      title: "New Beginnings",
      content: fallbackContent,
      wordCount: this.countWords(fallbackContent),
      timeRead: this.calculateReadTime(fallbackContent)
    };
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  private calculateReadTime(text: string): string {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(this.countWords(text) / wordsPerMinute);
    return `${minutes} min read`;
  }

  // Legacy compatibility methods
  getChapters(): Chapter[] {
    // This would need to be implemented based on your needs
    // For now, return empty array since we're moving to page-based system
    return [];
  }

  getCurrentChapter(): number {
    return this.storyState?.current_chapter || 1;
  }

  getContext(): StoryContext {
    return this.context;
  }

  getUserId(): string {
    return this.userId;
  }

  getApiUrl(): string {
    return this.baseUrl;
  }

  // New page-based methods
  getCurrentPage(): number {
    return this.storyState?.current_page || 1;
  }

  getTotalPages(): number {
    return this.storyState?.total_pages || 0;
  }
}

export const apiService = new ApiService();
export type { Chapter, StoryContext, PageResponse, StoryState };