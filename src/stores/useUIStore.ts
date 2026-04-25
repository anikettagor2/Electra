import { create } from 'zustand';

interface UIState {
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  currentStep: 1,
  totalSteps: 5,
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, state.totalSteps) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  setStep: (step) => set({ currentStep: step }),
  resetStep: () => set({ currentStep: 1 }),
}));
