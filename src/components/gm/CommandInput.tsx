// src/components/gm/CommandInput.tsx
import React, { useState } from 'react';
import { Wand2, Sparkles } from 'lucide-react';

interface CommandInputProps {
  onCommand: (command: { type: string; content: string }) => void;
  onCharacterAction: (action: { type: string; content: string }) => void;
}

export const CommandInput: React.FC<CommandInputProps> = ({ onCommand, onCharacterAction }) => {
  const [input, setInput] = useState('');
  const [commandType, setCommandType] = useState('narration');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async () => {
    if (!input.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      if (commandType === 'gm') {
        await onCommand({ type: 'gm_command', content: input });
      } else {
        await onCharacterAction({ type: commandType, content: input });
      }
      
      setInput('');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  
  const quickActions = [
    { type: 'dialogue', label: '💬 Speak' },
    { type: 'action', label: '⚔️ Act' },
    { type: 'scene', label: '🗺️ Scene' }
  ];
  
  return (
    <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/30">
      <div className="flex items-center space-x-3 mb-3">
        <select
          value={commandType}
          onChange={(e) => setCommandType(e.target.value)}
          className="px-3 py-2 bg-purple-900/50 text-purple-200 rounded-lg border border-purple-500/30 focus:outline-none focus:border-purple-400 transition-colors"
        >
          <option value="narration">📖 Narration</option>
          <option value="dialogue">💬 Dialogue</option>
          <option value="action">⚔️ Action</option>
          <option value="scene">🗺️ Scene</option>
          <option value="think">💭 Thought</option>
          <option value="gm">👑 GM Command</option>
        </select>
        
        <div className="flex space-x-1">
          {quickActions.map(action => (
            <button
              key={action.type}
              onClick={() => setCommandType(action.type)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                commandType === action.type
                  ? 'bg-purple-600/50 text-purple-200'
                  : 'bg-purple-900/30 text-purple-300 hover:bg-purple-900/50'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
        
        <button
          type="button"
          className="p-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 transition-colors"
          title="Magic suggestions"
        >
          <Wand2 className="w-4 h-4 text-purple-300" />
        </button>
      </div>
      
      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={
            commandType === 'gm' 
              ? "Shape the world with your command..." 
              : "Weave your story..."
          }
          className="w-full px-4 py-3 bg-black/30 text-white rounded-xl border border-purple-500/30 focus:outline-none focus:border-purple-400 placeholder-purple-300/50 resize-none transition-colors"
          rows={3}
        />
        
        <div className="absolute bottom-3 right-3 flex items-center space-x-2">
          {input.length > 0 && (
            <span className="text-xs text-purple-400">{input.length}</span>
          )}
          
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isProcessing}
            className={`px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
              isProcessing 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:from-purple-500 hover:to-pink-500 transform hover:scale-105'
            }`}
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Casting...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Cast</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Command hints */}
      <div className="mt-2 flex items-center space-x-4 text-xs text-purple-400">
        <span>Enter to cast</span>
        <span>•</span>
        <span>Shift+Enter for new line</span>
        <span>•</span>
        <span>@ to mention character</span>
      </div>
    </div>
  );
};