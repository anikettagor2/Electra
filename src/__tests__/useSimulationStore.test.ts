import { describe, it, expect, beforeEach } from 'vitest';
import { useSimulationStore } from '../stores/useSimulationStore';

describe('useSimulationStore', () => {
  beforeEach(() => {
    useSimulationStore.getState().reset();
  });

  it('should initialize with default state', () => {
    const state = useSimulationStore.getState();
    expect(state.country).toBe('India');
    expect(state.electionType).toBe('General');
    expect(state.role).toBe('Voter');
    expect(state.keyDecisions).toEqual([]);
  });

  it('should set country', () => {
    useSimulationStore.getState().setCountry('USA');
    expect(useSimulationStore.getState().country).toBe('USA');
  });

  it('should set electionType', () => {
    useSimulationStore.getState().setElectionType('State');
    expect(useSimulationStore.getState().electionType).toBe('State');
  });

  it('should set role', () => {
    useSimulationStore.getState().setRole('Candidate');
    expect(useSimulationStore.getState().role).toBe('Candidate');
  });

  it('should set user profile', () => {
    const profile = { age: 30, state: 'Maharashtra', registrationStatus: 'Not Registered' };
    useSimulationStore.getState().setUserProfile(profile);
    expect(useSimulationStore.getState().userProfile).toEqual(profile);
  });

  it('should set budget split', () => {
    const split = { digital: 50, ground: 30, traditional: 20 };
    useSimulationStore.getState().setBudgetSplit(split);
    expect(useSimulationStore.getState().budgetSplit).toEqual(split);
  });

  it('should toggle decisions', () => {
    useSimulationStore.getState().toggleDecision('Decision A');
    expect(useSimulationStore.getState().keyDecisions).toEqual(['Decision A']);
    
    useSimulationStore.getState().toggleDecision('Decision B');
    expect(useSimulationStore.getState().keyDecisions).toEqual(['Decision A', 'Decision B']);
    
    useSimulationStore.getState().toggleDecision('Decision A');
    expect(useSimulationStore.getState().keyDecisions).toEqual(['Decision B']);
  });

  it('should reset to initial state', () => {
    useSimulationStore.getState().setCountry('USA');
    useSimulationStore.getState().toggleDecision('Decision A');
    
    useSimulationStore.getState().reset();
    
    const state = useSimulationStore.getState();
    expect(state.country).toBe('India');
    expect(state.keyDecisions).toEqual([]);
  });
});
