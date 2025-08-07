// src/components/gm/WorldPanel.tsx
import React from 'react';
import { Globe, Users, Scroll, Map, Settings } from 'lucide-react';

interface World {
  id: string;
  name: string;
  genre: string;
  description: string;
  characterCount: number;
  eventCount: number;
  locations: string[];
}

interface WorldPanelProps {
  world: World;
}

export const WorldPanel: React.FC<WorldPanelProps> = ({ world }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-white">{world.name}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-purple-500/30 rounded-full text-xs text-purple-200">
            {world.genre}
          </span>
          <button className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Settings className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
      
      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        {world.description}
      </p>
      
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-black/30 rounded-lg p-3 text-center">
          <Users className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <div className="text-white font-bold">{world.characterCount}</div>
          <div className="text-xs text-gray-400">Characters</div>
        </div>
        <div className="bg-black/30 rounded-lg p-3 text-center">
          <Scroll className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <div className="text-white font-bold">{world.eventCount}</div>
          <div className="text-xs text-gray-400">Events</div>
        </div>
        <div className="bg-black/30 rounded-lg p-3 text-center">
          <Map className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <div className="text-white font-bold">{world.locations.length}</div>
          <div className="text-xs text-gray-400">Locations</div>
        </div>
      </div>
      
      {/* Locations List */}
      {world.locations.length > 0 && (
        <div className="mt-4 pt-4 border-t border-purple-500/20">
          <h3 className="text-sm font-semibold text-purple-300 mb-2">Key Locations</h3>
          <div className="space-y-1">
            {world.locations.slice(0, 4).map((location, index) => (
              <div key={index} className="flex items-center space-x-2 text-xs">
                <Map className="w-3 h-3 text-purple-400" />
                <span className="text-gray-300">{location}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};