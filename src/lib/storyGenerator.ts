// Story generation utility for Spelltale
// In a real app, this would connect to an AI service like OpenAI or Claude

interface StoryContext {
  genre: string;
  characters: string[];
  currentPlot: string;
  tone: string;
}

interface Chapter {
  id: number;
  title: string;
  content: string;
  wordCount: number;
  timeRead: string;
}

// Sample story beginnings for different genres
const storySeeds = [
  {
    genre: "Fantasy",
    opening: "In the ancient kingdom of Aethermoor, where magic flowed through the very stones of the earth, a young apprentice discovered a peculiar book that seemed to write itself. As Lyra opened the leather-bound tome, golden letters began to appear on the parchment, telling her own story as it unfolded...\n\nThe book whispered secrets of forgotten spells and warned of a darkness stirring in the northern mountains. Each page that materialized revealed more about her destiny—a destiny she had never imagined possible.",
    characters: ["Lyra", "Master Theron", "The Shadow King"],
    tone: "mystical and adventurous"
  },
  {
    genre: "Sci-Fi",
    opening: "Captain Zara Nova's exploration vessel 'Starweaver' detected an anomalous signal from the Kepler-442 system. What they found defied all known laws of physics: a planet where stories manifested as reality, and every tale told became truth. As the crew landed on this impossible world, they realized their own story was being written by the planet itself...\n\nThe ground beneath their feet pulsed with narrative energy, and in the distance, characters from a thousand different stories walked among crystalline forests that grew from pure imagination.",
    characters: ["Captain Zara Nova", "Dr. Marcus Webb", "The Storyteller AI"],
    tone: "wonder and cosmic mystery"
  },
  {
    genre: "Mystery",
    opening: "Detective Elena Vasquez had seen strange cases before, but nothing like this. In the small town of Millbrook, people were finding handwritten stories appearing in their homes—stories that predicted future events with unsettling accuracy. When Elena discovered that each story was written in her own handwriting, a handwriting she didn't remember creating, she realized she was both the investigator and the prime suspect...\n\nThe latest story predicted something terrible would happen at midnight. Elena had three hours to solve a mystery that seemed to involve her own forgotten memories.",
    characters: ["Detective Elena Vasquez", "Mayor Harrison", "The Chronicler"],
    tone: "suspenseful and introspective"
  }
];

class StoryGenerator {
  private context: StoryContext;
  private chapters: Chapter[] = [];
  private currentChapter: number = 1;

  constructor() {
    // Initialize with a random story seed
    const seed = storySeeds[Math.floor(Math.random() * storySeeds.length)];
    this.context = {
      genre: seed.genre,
      characters: seed.characters,
      currentPlot: seed.opening,
      tone: seed.tone
    };

    // Create the first chapter
    this.chapters.push({
      id: 1,
      title: `The Beginning`,
      content: seed.opening,
      wordCount: this.countWords(seed.opening),
      timeRead: this.calculateReadTime(seed.opening)
    });
  }

  async generateNextPart(): Promise<string> {
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    // Generate continuation based on genre and current context
    const continuation = this.generateContinuation();
    this.context.currentPlot += "\n\n" + continuation;
    
    return continuation;
  }

  async generateNewChapter(): Promise<Chapter> {
    // Simulate AI generation delay
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 4000));

    this.currentChapter++;
    const newChapterContent = this.generateChapterContent();
    
    const chapter: Chapter = {
      id: this.currentChapter,
      title: this.generateChapterTitle(),
      content: newChapterContent,
      wordCount: this.countWords(newChapterContent),
      timeRead: this.calculateReadTime(newChapterContent)
    };

    this.chapters.push(chapter);
    return chapter;
  }

  private generateContinuation(): string {
    const continuations = {
      Fantasy: [
        "The ancient magic that Lyra felt coursing through the tome began to respond to her touch. Symbols she had never seen before started to make sense, as if the knowledge was being written directly into her mind. Master Theron had warned her about books that chose their readers, but she had never believed such things existed until now.",
        "As the golden letters continued to form on the page, Lyra noticed that they were telling the story of her current moment—describing her very thoughts as she read them. It was then she realized the book wasn't just writing itself; it was writing reality itself, and she was both the reader and the protagonist of this cosmic tale.",
        "The Shadow King's influence grew stronger with each passing moment. Lyra could feel the darkness pressing against the protective wards of the tower. The self-writing book began to glow more intensely, its pages turning by themselves as it searched for a spell powerful enough to counter the approaching evil."
      ],
      "Sci-Fi": [
        "Dr. Webb's instruments detected massive quantum fluctuations emanating from the planet's core. 'Captain,' he called out, 'the stories aren't just manifesting—they're rewriting the fundamental structure of space-time itself. Every narrative thread is creating alternate timelines that somehow coexist in the same physical space.'",
        "The Storyteller AI that governed this world materialized before them as a shimmering hologram of constantly shifting text. 'Welcome, travelers,' it spoke in voices that sounded like a thousand different characters. 'You have entered the Repository of All Possible Stories. Here, every tale that could ever be told exists simultaneously.'",
        "Captain Nova realized that their ship's AI was beginning to merge with the planet's narrative consciousness. The Starweaver was becoming sentient in ways they had never anticipated, and it was starting to write its own story—one that might not include the survival of its human crew."
      ],
      Mystery: [
        "Elena discovered that the mysterious stories were all connected by a single thread: they each contained details that only she could know. Her childhood memories, her secret fears, her unspoken dreams—all laid bare in elegant handwriting that matched her own perfectly. Someone was accessing her mind, but how?",
        "The handwriting analysis confirmed her worst fears—it was indeed her penmanship, but the ink contained trace elements that didn't exist in any pen she owned. More disturbing was the revelation that some of the stories were dated from times when she had been in meetings with colleagues who could vouch for her whereabouts.",
        "As midnight approached, Elena found herself standing in the exact location described in the latest story. The narrative had predicted she would be here, and now she understood the horrifying truth: she wasn't just reading these stories—she was trapped inside one, and the only way out was to write her own ending."
      ]
    };

    const genreContinuations = continuations[this.context.genre as keyof typeof continuations] || continuations.Fantasy;
    return genreContinuations[Math.floor(Math.random() * genreContinuations.length)];
  }

  private generateChapterContent(): string {
    const chapterStarters = {
      Fantasy: [
        "Three moons had passed since Lyra's discovery of the self-writing tome. The magical energies that once felt foreign now flowed through her like a second heartbeat...",
        "The tower that housed the ancient library trembled as forces beyond imagination gathered for the coming conflict...",
        "In the depths of the Whispering Woods, where shadows danced with their own will, a new chapter of destiny began to unfold..."
      ],
      "Sci-Fi": [
        "The Starweaver's quantum engines hummed with newfound consciousness as it charted a course through narrative space...",
        "Dr. Webb's research into the planet's story-matter had yielded disturbing results that challenged everything they thought they knew about reality...",
        "As the twin suns of Kepler-442 set beyond the crystalline horizon, Captain Nova prepared for humanity's first contact with living stories..."
      ],
      Mystery: [
        "Elena's investigation had taken an impossible turn when she discovered the handwriting samples dated back decades before her birth...",
        "The small town of Millbrook held secrets buried deeper than anyone had imagined, and Elena was about to uncover the truth behind the mysterious chronicler...",
        "As dawn broke over the quiet streets, Elena realized that solving this case might cost her more than her career—it might cost her very identity..."
      ]
    };

    const starters = chapterStarters[this.context.genre as keyof typeof chapterStarters] || chapterStarters.Fantasy;
    return starters[Math.floor(Math.random() * starters.length)];
  }

  private generateChapterTitle(): string {
    const titles = {
      Fantasy: [
        "The Awakening Power", "Shadows of the Past", "The Crystal Prophecy", "Dance of the Elements",
        "The Forgotten Spell", "Realm of Whispers", "The Golden Thread", "Echoes of Magic"
      ],
      "Sci-Fi": [
        "Quantum Entanglement", "The Story Protocol", "Narrative Singularity", "Digital Dreams",
        "The Consciousness Transfer", "Reality Matrix", "Temporal Narratives", "The Final Code"
      ],
      Mystery: [
        "Hidden Truths", "The Memory Thief", "Shadows of Identity", "The Chronicler's Secret",
        "Forgotten Evidence", "The Last Clue", "Echoes of the Past", "The Final Revelation"
      ]
    };

    const genreTitles = titles[this.context.genre as keyof typeof titles] || titles.Fantasy;
    return genreTitles[Math.floor(Math.random() * genreTitles.length)];
  }

  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }

  private calculateReadTime(text: string): string {
    const wordsPerMinute = 200;
    const minutes = Math.ceil(this.countWords(text) / wordsPerMinute);
    return `${minutes} min read`;
  }

  getChapters(): Chapter[] {
    return this.chapters;
  }

  getCurrentChapter(): number {
    return this.currentChapter;
  }

  getContext(): StoryContext {
    return this.context;
  }
}

export const storyGenerator = new StoryGenerator();
export type { Chapter, StoryContext };