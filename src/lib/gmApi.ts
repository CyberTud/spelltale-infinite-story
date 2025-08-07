// src/lib/gmApi.ts
// API service for Game Master features

interface WorldData {
  name: string;
  description: string;
  genre: string;
  atmosphere?: string;
  key_locations?: string[];
  rules?: string;
  historical_events?: string[];
}

interface CharacterData {
  name: string;
  role: string;
  personality: string;
  backstory: string;
  goals: string[];
  traits: string[];
  appearance: string;
  voice_style?: string;
  relationships?: Record<string, string>;
}

interface CharacterAction {
  character_id: string;
  action_type: string;
  target?: string;
  content: string;
  context?: Record<string, any>;
}

interface GMCommand {
  command: string;
  parameters: Record<string, any>;
}

class GMApiService {
  private baseUrl: string;
  private ws: WebSocket | null = null;

  constructor() {
    this.baseUrl = import.meta.env?.VITE_API_URL || 'http://localhost:8000';
    console.log('GM API initialized with URL:', this.baseUrl);
  }

  // User Management
  private getUserId(): string {
    let userId = sessionStorage.getItem('gm_user_id');
    if (!userId) {
      userId = 'gm_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      sessionStorage.setItem('gm_user_id', userId);
    }
    return userId;
  }

  // World Management
  async createWorld(worldData: WorldData) {
    try {
      const response = await fetch(`${this.baseUrl}/world/create?user_id=${this.getUserId()}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(worldData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create world:', error);
      throw error;
    }
  }

  async getWorlds() {
    try {
      const response = await fetch(`${this.baseUrl}/worlds/${this.getUserId()}`, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get worlds:', error);
      throw error;
    }
  }

  // Character Management
  async createCharacter(worldId: string, characterData: CharacterData) {
    try {
      const response = await fetch(`${this.baseUrl}/character/create/${worldId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(characterData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create character:', error);
      throw error;
    }
  }

  async getCharacters(worldId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/characters/${worldId}`, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get characters:', error);
      throw error;
    }
  }

  // Character Actions
  async performAction(actionData: CharacterAction) {
    try {
      const response = await fetch(`${this.baseUrl}/character/action`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(actionData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to perform character action:', error);
      throw error;
    }
  }

  // World Simulation
  async simulateWorld(worldId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/world/${worldId}/simulate`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to simulate world:', error);
      throw error;
    }
  }

  // GM Commands
  async executeCommand(worldId: string, command: GMCommand) {
    try {
      const response = await fetch(`${this.baseUrl}/gm/command?world_id=${worldId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(command)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to execute GM command:', error);
      throw error;
    }
  }

  // Session Management
  async saveSession(worldId: string, sessionName: string) {
    try {
      const response = await fetch(`${this.baseUrl}/session/save`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ 
          world_id: worldId, 
          session_name: sessionName 
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to save session:', error);
      throw error;
    }
  }

  async getSessions(worldId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/sessions/${worldId}`, {
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get sessions:', error);
      throw error;
    }
  }

  // WebSocket for real-time updates
  connectToWorld(worldId: string, onMessage: (data: any) => void): WebSocket {
    try {
      // Close existing connection if any
      this.disconnectFromWorld();
      
      const wsUrl = this.baseUrl.replace('http://', 'ws://').replace('https://', 'wss://');
      this.ws = new WebSocket(`${wsUrl}/ws/${worldId}`);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected to world:', worldId);
        // Send initial ping
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'ping' }));
        }
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
      };

      // Keep alive with periodic pings
      const pingInterval = setInterval(() => {
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({ type: 'ping' }));
        } else {
          clearInterval(pingInterval);
        }
      }, 30000); // Ping every 30 seconds

      return this.ws;
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      throw error;
    }
  }

  disconnectFromWorld() {
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
      this.ws = null;
    }
  }

  // Request world state
  async getWorldState(worldId: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ 
        type: 'request_state' 
      }));
    }
  }

  // Health check
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { status: 'error', message: error };
    }
  }
}

// Export singleton instance
export const gmApi = new GMApiService();

// Export types
export type { WorldData, CharacterData, CharacterAction, GMCommand };