import { create } from 'zustand';

interface SimulationState {
  country: string;
  electionType: string;
  role: string;
  userProfile: {
    age: number;
    state: string;
    registrationStatus: string;
  };
  setCountry: (country: string) => void;
  setElectionType: (type: string) => void;
  setRole: (role: string) => void;
  setUserProfile: (profile: { age: number; state: string; registrationStatus: string }) => void;
  setBudgetSplit: (budget: { digital: number; ground: number; traditional: number }) => void;
  toggleDecision: (decision: string) => void;
  reset: () => void;
  budgetSplit: {
    digital: number;
    ground: number;
    traditional: number;
  };
  keyDecisions: string[];
}

const initialState = {
  country: 'India',
  electionType: 'General',
  role: 'Voter',
  userProfile: {
    age: 25,
    state: 'Delhi',
    registrationStatus: 'Registered',
  },
  budgetSplit: {
    digital: 33,
    ground: 34,
    traditional: 33,
  },
  keyDecisions: [],
};

export const useSimulationStore = create<SimulationState>((set) => ({
  ...initialState,
  setCountry: (country) => set({ country }),
  setElectionType: (electionType) => set({ electionType }),
  setRole: (role) => set({ role }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setBudgetSplit: (budgetSplit) => set({ budgetSplit }),
  toggleDecision: (decision) => set((state) => ({
    keyDecisions: state.keyDecisions.includes(decision)
      ? state.keyDecisions.filter((d) => d !== decision)
      : [...state.keyDecisions, decision],
  })),
  reset: () => set(initialState),
}));
