import { create } from 'zustand';

export interface SimulationResult {
  scenario: { summary: string; context: string };
  publicReaction: { urban: string; rural: string; youth: string; media: string };
  result: { winner: string; voteShare: Record<string, number>; turnout: number; swingFactor: string };
  impact: { worked: string[]; failed: string[]; missed: string[] };
  aiInsight: string;
  whatIf: string[];
}

interface ResultState {
  data: Partial<SimulationResult> | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  setPartialData: (data: Partial<SimulationResult>) => void;
  setStatus: (status: 'idle' | 'loading' | 'success' | 'error') => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useResultStore = create<ResultState>((set) => ({
  data: null,
  status: 'idle',
  error: null,
  setPartialData: (data) => set((state) => ({ 
    data: { 
      ...state.data, 
      ...data,
      result: data.result ? { ...state.data?.result, ...data.result } : state.data?.result,
      impact: data.impact ? { ...state.data?.impact, ...data.impact } : state.data?.impact,
      scenario: data.scenario ? { ...state.data?.scenario, ...data.scenario } : state.data?.scenario,
      publicReaction: data.publicReaction ? { ...state.data?.publicReaction, ...data.publicReaction } : state.data?.publicReaction,
    } as Partial<SimulationResult>
  })),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  reset: () => set({ data: null, status: 'idle', error: null }),
}));
