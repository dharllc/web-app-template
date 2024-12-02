// File: frontend/src/types/session.ts
export interface Session {
    id: string;
    title: string;
    createdAt: string;
    lastModified: string;
    status: 'in_progress' | 'completed';
    input: string[];
    suggestions: string[];
    output: string;
    progress: number;
  }
  
  export interface SessionsState {
    sessions: Session[];
    activeSessionId: string | null;
    loading: boolean;
    error: string | null;
  }