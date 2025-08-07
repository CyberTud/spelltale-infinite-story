// src/components/gm/QuickActions.tsx
import React from 'react';
import { Swords, Shield, Map, Sparkles, Dice6, Heart, Skull, Coins } from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: { type: string; content: string }) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const actions = [
    { icon: Swords, label: 'Battle', type: 'battle', color: 'text-red-400' },
    { icon: Shield, label: 'Rest', type: 'rest', color: 'text-blue-400' },
    { icon: Map, label: 'Travel', type: 'travel', color: 'text-green-400' },
    { icon: Sparkles, label: 'Magic', type: 'magic', color: 'text-purple-400' },
    { icon: Dice6, label: 'Random', type: 'random', color: 'text-yellow-400' },
    { icon: Coins, label: 'Treasure', type: 'treasure', color: 'text-amber-400' }
  ];
  
  const handleAction = (actionType: string) => {
    const actionMessages = {
      battle: 'A sudden threat emerges from the shadows!',
      rest: 'The party finds a safe place to rest and recover.',
      travel: 'The journey continues to a new location.',
      magic: 'Mystical energies surge through the area.',
      random: 'Something unexpected is about to happen...',
      treasure: 'A hidden cache of treasures has been discovered!'
    };
    
    onAction({
      type: 'gm_command',
      content: actionMessages[actionType as keyof typeof actionMessages] || 'Something happens...'
    });
  };
  
  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
      <h3 className="text-sm font-bold text-purple-300 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-2">
        {actions.map(({ icon: Icon, label, type, color }) => (
          <button
            key={type}
            onClick={() => handleAction(type)}
            className="p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-all duration-200 flex flex-col items-center group hover:scale-105"
          >
            <Icon className={`w-5 h-5 ${color} mb-1 group-hover:scale-110 transition-transform`} />
            <span className="text-xs text-gray-300">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};