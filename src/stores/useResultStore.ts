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
  setPartialData: (data) => set((state) => {
    const newData = { ...state.data, ...data };
    
    if (data.result) newData.result = { ...state.data?.result, ...data.result } as SimulationResult['result'];
    if (data.impact) newData.impact = { ...state.data?.impact, ...data.impact } as SimulationResult['impact'];
    if (data.scenario) newData.scenario = { ...state.data?.scenario, ...data.scenario } as SimulationResult['scenario'];
    if (data.publicReaction) newData.publicReaction = { ...state.data?.publicReaction, ...data.publicReaction } as SimulationResult['publicReaction'];
    
    return { data: newData };
  }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  reset: () => set({ data: null, status: 'idle', error: null }),
}));
