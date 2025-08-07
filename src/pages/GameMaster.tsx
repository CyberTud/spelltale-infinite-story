// src/pages/GameMaster.tsx
import React, { useState, useEffect } from 'react';
import { MagicalBackground } from '../components/gm/MagicalBackground';
import { CharacterCard } from '../components/gm/CharacterCard';
import { WorldPanel } from '../components/gm/WorldPanel';
import { StoryView } from '../components/gm/StoryView';
import { CommandInput } from '../components/gm/CommandInput';
import { QuickActions } from '../components/gm/QuickActions';
import { ActiveEffects } from '../components/gm/ActiveEffects';
import { gmApi } from '../lib/gmApi';
import { Crown, Play, Pause, Save, Volume2, VolumeX, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Character {
  id: string;
  name: string;
  role: string;
  health: number;
  energy: number;
  mood: string;
  active: boolean;
}

interface World {
  id: string;
  name: string;
  genre: string;
  description: string;
  characterCount: number;
  eventCount: number;
  locations: string[];
}

interface StoryEvent {
  id: string;
  type: string;
  character?: string;
  content: string;
  timestamp: string;
}

export default function GameMaster() {
  const { toast } = useToast();
  const [worldId, setWorldId] = useState<string>('');
  const [world, setWorld] = useState<World>({
    id: '',
    name: "Aethermoor",
    genre: "Fantasy",
    description: "A realm where magic flows through ancient ley lines and mythical creatures roam enchanted forests.",
    characterCount: 0,
    eventCount: 0,
    locations: []
  });
  
  const [characters, setCharacters] = useState<Character[]>([]);
  const [events, setEvents] = useState<StoryEvent[]>([]);
  const [activeCharacter, setActiveCharacter] = useState<Character | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);

  // Initialize world on component mount
  useEffect(() => {
    initializeWorld();
  }, []);

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (worldId) {
      const ws = gmApi.connectToWorld(worldId, handleWebSocketMessage);
      setWsConnection(ws);
      
      return () => {
        gmApi.disconnectFromWorld();
      };
    }
  }, [worldId]);

  // Auto-simulation timer
  useEffect(() => {
    if (isSimulating && worldId) {
      const interval = setInterval(() => {
        simulateWorldStep();
      }, 5000); // Simulate every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [isSimulating, worldId]);

  const initializeWorld = async () => {
    try {
      setIsLoading(true);
      
      // Get existing worlds or create a new one
      const worldsResponse = await gmApi.getWorlds();
      
      if (worldsResponse.worlds && worldsResponse.worlds.length > 0) {
        // Load the first world
        const firstWorld = worldsResponse.worlds[0];
        setWorld({
          id: firstWorld._id,
          name: firstWorld.name,
          genre: firstWorld.genre,
          description: firstWorld.description,
          characterCount: firstWorld.character_count || 0,
          eventCount: firstWorld.event_count || 0,
          locations: firstWorld.key_locations || []
        });
        setWorldId(firstWorld._id);
        
        // Load characters
        await loadCharacters(firstWorld._id);
      } else {
        // Create a default world
        await createDefaultWorld();
      }
    } catch (error) {
      console.error('Failed to initialize world:', error);
      toast({
        title: "Initialization Error",
        description: "Failed to load the game world. Please refresh and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultWorld = async () => {
    try {
      const worldData = {
        name: "Aethermoor",
        description: "A realm where magic flows through ancient ley lines and mythical creatures roam enchanted forests.",
        genre: "Fantasy",
        atmosphere: "Mystical and adventurous",
        key_locations: ["Crystal Spire", "Whispering Woods", "Shadowfen Marsh", "Dragon's Rest"],
        rules: "Magic is real, heroes rise from humble beginnings, and every choice shapes destiny."
      };
      
      const response = await gmApi.createWorld(worldData);
      
      setWorld({
        id: response.world_id,
        name: worldData.name,
        genre: worldData.genre,
        description: worldData.description,
        characterCount: 0,
        eventCount: 0,
        locations: worldData.key_locations
      });
      setWorldId(response.world_id);
      
      toast({
        title: "World Created",
        description: `Welcome to ${worldData.name}!`
      });
      
      // Create some default characters
      await createDefaultCharacters(response.world_id);
      
    } catch (error) {
      console.error('Failed to create world:', error);
    }
  };

  const createDefaultCharacters = async (worldId: string) => {
    const defaultCharacters = [
      {
        name: "Lyra Moonwhisper",
        role: "Elven Ranger",
        personality: "Brave and curious, with a deep connection to nature",
        backstory: "Raised by the forest spirits after her village was destroyed",
        goals: ["Protect the innocent", "Discover her true heritage"],
        traits: ["Keen senses", "Expert archer", "Animal whisperer"],
        appearance: "Tall and lithe with silver hair and emerald eyes"
      },
      {
        name: "Theron Ironforge",
        role: "Dwarven Warrior",
        personality: "Gruff but loyal, with an unbreakable sense of honor",
        backstory: "Last survivor of the Ironforge clan, seeking redemption",
        goals: ["Restore his clan's honor", "Forge the legendary weapon"],
        traits: ["Unmatched strength", "Master blacksmith", "Stubborn"],
        appearance: "Stocky build with a magnificent bronze beard and battle scars"
      }
    ];
    
    for (const charData of defaultCharacters) {
      try {
        await gmApi.createCharacter(worldId, charData);
      } catch (error) {
        console.error('Failed to create character:', error);
      }
    }
    
    await loadCharacters(worldId);
  };

  const loadCharacters = async (worldId: string) => {
    try {
      const response = await gmApi.getCharacters(worldId);
      
      if (response.characters) {
        const formattedChars = response.characters.map((char: any, index: number) => ({
          id: char._id,
          name: char.name,
          role: char.role,
          health: char.stats?.health || 100,
          energy: char.stats?.energy || 100,
          mood: char.emotional_state || 'neutral',
          active: index === 0
        }));
        
        setCharacters(formattedChars);
        if (formattedChars.length > 0) {
          setActiveCharacter(formattedChars[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load characters:', error);
    }
  };

  const handleWebSocketMessage = (data: any) => {
    if (data.type === 'character_action') {
      const newEvent: StoryEvent = {
        id: Date.now().toString(),
        type: 'action',
        character: data.character,
        content: data.content,
        timestamp: 'Just now'
      };
      setEvents(prev => [newEvent, ...prev]);
    } else if (data.type === 'scene_change') {
      const newEvent: StoryEvent = {
        id: Date.now().toString(),
        type: 'scene',
        content: data.content,
        timestamp: 'Just now'
      };
      setEvents(prev => [newEvent, ...prev]);
    }
  };

  const simulateWorldStep = async () => {
    if (!worldId) return;
    
    try {
      await gmApi.simulateWorld(worldId);
    } catch (error) {
      console.error('Simulation step failed:', error);
    }
  };

  const handleCommand = async (command: any) => {
    try {
      if (command.type === 'gm_command') {
        const gmCommand = {
          command: 'set_scene',
          parameters: {
            description: command.content,
            mood: 'mysterious'
          }
        };
        
        await gmApi.executeCommand(worldId, gmCommand);
      } else {
        const newEvent: StoryEvent = {
          id: Date.now().toString(),
          type: command.type,
          content: command.content,
          timestamp: 'Just now'
        };
        setEvents(prev => [newEvent, ...prev]);
      }
    } catch (error) {
      console.error('Failed to execute command:', error);
    }
  };

  const handleCharacterAction = async (action: any) => {
    if (!activeCharacter) return;
    
    try {
      const actionData = {
        character_id: activeCharacter.id,
        action_type: action.type,
        content: action.content,
        context: {}
      };
      
      const response = await gmApi.performAction(actionData);
      
      const newEvent: StoryEvent = {
        id: Date.now().toString(),
        type: action.type,
        character: activeCharacter.name,
        content: response.character_response,
        timestamp: 'Just now'
      };
      
      setEvents(prev => [newEvent, ...prev]);
      
      // Update character emotional state
      if (response.emotional_state) {
        setCharacters(prev => prev.map(char => 
          char.id === activeCharacter.id 
            ? { ...char, mood: response.emotional_state }
            : char
        ));
      }
    } catch (error) {
      console.error('Failed to perform character action:', error);
    }
  };

  const selectCharacter = (character: Character) => {
    setCharacters(chars => chars.map(c => ({
      ...c,
      active: c.id === character.id
    })));
    setActiveCharacter(character);
  };

  const saveSession = async () => {
    try {
      const sessionName = `Session ${new Date().toLocaleDateString()}`;
      await gmApi.saveSession(worldId, sessionName);
      
      toast({
        title: "Session Saved",
        description: "Your game has been saved successfully!"
      });
    } catch (error) {
      console.error('Failed to save session:', error);
      toast({
        title: "Save Failed",
        description: "Could not save the session. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 text-purple-400 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-purple-300">Loading World...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      <MagicalBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b border-purple-500/30 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Game Master
                </h1>
                <p className="text-xs text-purple-300">Weaving tales of wonder</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isSimulating 
                    ? 'bg-green-500/30 text-green-300 border border-green-500/50' 
                    : 'bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-gray-700/70'
                }`}
              >
                {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{isSimulating ? 'Simulating' : 'Paused'}</span>
              </button>
              
              <button 
                onClick={saveSession}
                className="p-2 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 transition-colors"
              >
                <Save className="w-5 h-5 text-purple-300" />
              </button>
              
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 transition-colors"
              >
                {soundEnabled ? <Volume2 className="w-5 h-5 text-gray-300" /> : <VolumeX className="w-5 h-5 text-gray-300" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Characters */}
          <div className="col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-purple-300">Characters</h2>
              <button className="p-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 transition-colors">
                <Plus className="w-4 h-4 text-purple-300" />
              </button>
            </div>
            
            <div className="space-y-3">
              {characters.map(character => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  onClick={selectCharacter}
                  isActive={character.active}
                />
              ))}
            </div>
          </div>
          
          {/* Center - Story View */}
          <div className="col-span-6 space-y-6">
            <StoryView events={events} />
            <CommandInput 
              onCommand={handleCommand}
              onCharacterAction={handleCharacterAction}
            />
          </div>
          
          {/* Right Sidebar - World Info & Actions */}
          <div className="col-span-3 space-y-4">
            <WorldPanel world={world} />
            <QuickActions onAction={handleCommand} />
            <ActiveEffects />
          </div>
        </div>
      </div>
    </div>
  );
}