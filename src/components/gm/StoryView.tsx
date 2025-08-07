// src/components/gm/StoryView.tsx
import React, { useRef, useEffect, useState } from 'react';
import { MessageCircle, Swords, BookOpen, Map, Crown } from 'lucide-react';

interface StoryEvent {
  id: string;
  type: string;
  character?: string;
  content: string;
  timestamp: string;
}

interface StoryViewProps {
  events: StoryEvent[];
}

const StoryEventItem: React.FC<{ event: StoryEvent; isLatest: boolean }> = ({ event, isLatest }) => {
  const typeIcons = {
    dialogue: MessageCircle,
    action: Swords,
    narration: BookOpen,
    scene: Map,
    gm_event: Crown,
    speak: MessageCircle,
    move: Map,
    interact: Swords,
    think: BookOpen,
    observe: BookOpen
  };
  
  const TypeIcon = typeIcons[event.type as keyof typeof typeIcons] || BookOpen;
  
  return (
    <div className={`relative mb-4 p-4 rounded-xl transition-all duration-300 ${
      isLatest 
        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-400/50' 
        : 'bg-white/5 backdrop-blur border border-white/10'
    }`}>
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${
          event.type === 'gm_event' 
            ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30' 
            : 'bg-purple-500/20'
        }`}>
          <TypeIcon className="w-4 h-4 text-purple-300" />
        </div>
        
        <div className="flex-1">
          {event.character && (
            <div className="font-semibold text-purple-300 text-sm mb-1">
              {event.character}
            </div>
          )}
          <p className="text-gray-200 leading-relaxed">
            {event.content}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            {event.timestamp}
          </div>
        </div>
      </div>
      
      {isLatest && (
        <div className="absolute -top-2 -right-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping" />
        </div>
      )}
    </div>
  );
};

export const StoryView: React.FC<StoryViewProps> = ({ events }) => {
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [events, autoScroll]);
  
  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-purple-300">Story</h2>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">Auto-scroll</span>
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className="w-8 h-4 bg-purple-600/50 rounded-full relative cursor-pointer transition-colors"
          >
            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${
              autoScroll ? 'left-4' : 'left-0.5'
            }`} />
          </button>
        </div>
      </div>
      
      <div ref={scrollRef} className="max-h-[60vh] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-purple-600/50 scrollbar-track-transparent">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-purple-400/30 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Your story begins here...</p>
            <p className="text-gray-600 text-xs mt-2">Use the command input below to start weaving your tale</p>
          </div>
        ) : (
          events.map((event, index) => (
            <StoryEventItem 
              key={event.id} 
              event={event} 
              isLatest={index === 0}
            />
          ))
        )}
      </div>
    </div>
  );
};