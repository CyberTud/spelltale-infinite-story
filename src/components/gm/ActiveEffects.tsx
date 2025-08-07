// src/components/gm/ActiveEffects.tsx
import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Shield, Heart, Skull, Clock } from 'lucide-react';

interface Effect {
  id: string;
  name: string;
  type: 'buff' | 'debuff' | 'neutral';
  icon: React.ElementType;
  duration: number;
  color: string;
}

export const ActiveEffects: React.FC = () => {
  const [effects, setEffects] = useState<Effect[]>([
    {
      id: '1',
      name: 'Blessing of Light',
      type: 'buff',
      icon: Sparkles,
      duration: 5,
      color: 'purple'
    },
    {
      id: '2',
      name: 'Cursed',
      type: 'debuff',
      icon: Skull,
      duration: 2,
      color: 'red'
    },
    {
      id: '3',
      name: 'Shield Wall',
      type: 'buff',
      icon: Shield,
      duration: 3,
      color: 'blue'
    }
  ]);
  
  // Countdown timer for effects
  useEffect(() => {
    const interval = setInterval(() => {
      setEffects(prevEffects => 
        prevEffects
          .map(effect => ({
            ...effect,
            duration: effect.duration - 1
          }))
          .filter(effect => effect.duration > 0)
      );
    }, 10000); // Update every 10 seconds for demo
    
    return () => clearInterval(interval);
  }, []);
  
  const getEffectStyles = (type: 'buff' | 'debuff' | 'neutral', color: string) => {
    const baseStyles = {
      buff: `bg-${color}-600/20 border-${color}-500/30`,
      debuff: 'bg-red-600/20 border-red-500/30',
      neutral: 'bg-gray-600/20 border-gray-500/30'
    };
    
    return baseStyles[type];
  };
  
  return (
    <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-purple-300">Active Effects</h3>
        <Clock className="w-4 h-4 text-purple-400" />
      </div>
      
      {effects.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-xs text-gray-500">No active effects</p>
        </div>
      ) : (
        <div className="space-y-2">
          {effects.map((effect) => {
            const Icon = effect.icon;
            return (
              <div
                key={effect.id}
                className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${
                  effect.type === 'buff' 
                    ? 'bg-purple-600/20 border border-purple-500/30' 
                    : effect.type === 'debuff'
                    ? 'bg-red-600/20 border border-red-500/30'
                    : 'bg-gray-600/20 border border-gray-500/30'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4 ${
                    effect.type === 'buff' 
                      ? 'text-purple-400' 
                      : effect.type === 'debuff'
                      ? 'text-red-400'
                      : 'text-gray-400'
                  }`} />
                  <span className={`text-xs ${
                    effect.type === 'buff' 
                      ? 'text-purple-200' 
                      : effect.type === 'debuff'
                      ? 'text-red-200'
                      : 'text-gray-200'
                  }`}>
                    {effect.name}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-400">{effect.duration}</span>
                  <span className="text-xs text-gray-500">turns</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Add Effect Button */}
      <button className="w-full mt-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg text-xs text-purple-300 transition-colors flex items-center justify-center space-x-1">
        <Sparkles className="w-3 h-3" />
        <span>Add Effect</span>
      </button>
    </div>
  );
};