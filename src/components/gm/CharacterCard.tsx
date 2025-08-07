// src/components/gm/CharacterCard.tsx
import React from 'react';
import { Heart, Zap, Sun, Cloud, Moon, Star, Sparkles } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  role: string;
  health: number;
  energy: number;
  mood: string;
  active: boolean;
}

interface CharacterCardProps {
  character: Character;
  onClick: (character: Character) => void;
  isActive: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({ character, onClick, isActive }) => {
  const moodIcons = {
    happy: Sun,
    sad: Cloud,
    angry: Zap,
    neutral: Moon,
    excited: Star,
    engaged: Sparkles,
    contemplative: Moon,
    curious: Star,
    tense: Zap,
    melancholic: Cloud
  };
  
  const MoodIcon = moodIcons[character.mood as keyof typeof moodIcons] || Moon;
  
  return (
    <div
      onClick={() => onClick(character)}
      className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-br from-purple-600/30 to-pink-600/30 border-2 border-purple-400 scale-105 shadow-2xl' 
          : 'bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20 hover:scale-102 hover:shadow-xl'
      }`}
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
            {character.name[0]}
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-gray-900 animate-pulse" />
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-bold text-lg">{character.name}</h3>
          <p className="text-purple-200 text-sm">{character.role}</p>
          
          <div className="mt-2 space-y-1">
            <div className="flex items-center space-x-2">
              <Heart className="w-3 h-3 text-red-400" />
              <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${character.health}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{character.health}%</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="w-3 h-3 text-yellow-400" />
              <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                  style={{ width: `${character.energy}%` }}
                />
              </div>
              <span className="text-xs text-gray-400">{character.energy}%</span>
            </div>
          </div>
          
          <div className="mt-2 flex items-center space-x-2">
            <MoodIcon className="w-4 h-4 text-purple-300" />
            <span className="text-xs text-purple-200 capitalize">{character.mood}</span>
          </div>
        </div>
      </div>
      
      {isActive && (
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" />
        </div>
      )}
    </div>
  );
};