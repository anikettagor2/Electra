import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '../stores/useUIStore';

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.getState().resetStep();
  });

  it('should initialize with step 1', () => {
    expect(useUIStore.getState().currentStep).toBe(1);
    expect(useUIStore.getState().totalSteps).toBe(5);
  });

  it('should increment step on nextStep', () => {
    useUIStore.getState().nextStep();
    expect(useUIStore.getState().currentStep).toBe(2);
  });

  it('should not increment beyond totalSteps', () => {
    const store = useUIStore.getState();
    for (let i = 0; i < 10; i++) {
      useUIStore.getState().nextStep();
    }
    expect(useUIStore.getState().currentStep).toBe(5);
  });

  it('should decrement step on prevStep', () => {
    useUIStore.getState().nextStep();
    useUIStore.getState().nextStep();
    useUIStore.getState().prevStep();
    expect(useUIStore.getState().currentStep).toBe(2);
  });

  it('should not decrement below 1', () => {
    useUIStore.getState().prevStep();
    expect(useUIStore.getState().currentStep).toBe(1);
  });

  it('should set step to specific value', () => {
    useUIStore.getState().setStep(3);
    expect(useUIStore.getState().currentStep).toBe(3);
  });

  it('should reset step to 1', () => {
    useUIStore.getState().setStep(4);
    useUIStore.getState().resetStep();
    expect(useUIStore.getState().currentStep).toBe(1);
  });
});
