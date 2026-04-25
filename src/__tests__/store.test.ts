import { describe, it, expect, beforeEach } from 'vitest';
import { useSimulationStore } from '../stores/useSimulationStore';

describe('useSimulationStore', () => {
  beforeEach(() => {
    useSimulationStore.getState().reset();
  });

  it('should have initial state', () => {
    const state = useSimulationStore.getState();
    expect(state.country).toBe('India');
    expect(state.electionType).toBe('General');
    expect(state.budgetSplit.digital).toBe(33);
  });

  it('should update country', () => {
    useSimulationStore.getState().setCountry('USA');
    expect(useSimulationStore.getState().country).toBe('USA');
  });

  it('should toggle decisions', () => {
    const decision = 'Focus on Youth';
    useSimulationStore.getState().toggleDecision(decision);
    expect(useSimulationStore.getState().keyDecisions).toContain(decision);

    useSimulationStore.getState().toggleDecision(decision);
    expect(useSimulationStore.getState().keyDecisions).not.toContain(decision);
  });

  it('should update budget split', () => {
    const newBudget = { digital: 50, ground: 25, traditional: 25 };
    useSimulationStore.getState().setBudgetSplit(newBudget);
    expect(useSimulationStore.getState().budgetSplit).toEqual(newBudget);
  });
});
