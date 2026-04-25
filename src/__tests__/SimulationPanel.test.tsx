import { render, screen, fireEvent } from '@testing-library/react';
import { SimulationPanel } from '../features/simulation/SimulationPanel';
import { useUIStore } from '../stores/useUIStore';
import { useSimulationStore } from '../stores/useSimulationStore';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock the stores and hooks
vi.mock('../hooks/useGeminiStream', () => ({
  useGeminiStream: () => ({
    runSimulation: vi.fn(),
    isLoading: false,
  }),
}));

vi.mock('../components/ui/slider', () => ({
  Slider: ({ 'aria-label': ariaLabel, onValueChange }: any) => (
    <input 
      type="range" 
      aria-label={ariaLabel} 
      onChange={(e) => onValueChange([Number(e.target.value)])} 
    />
  ),
}));

describe('SimulationPanel', () => {
  beforeEach(() => {
    useUIStore.getState().resetStep();
    useSimulationStore.getState().reset();
  });

  it('renders the initial step correctly', () => {
    render(<SimulationPanel />);
    expect(screen.getByText(/Setup Election Scenario/i)).toBeInTheDocument();
  });

  it('allows selecting country and election type', () => {
    render(<SimulationPanel />);
    const countrySelect = screen.getByRole('combobox', { name: /Country/i });
    fireEvent.change(countrySelect, { target: { value: 'USA' } });
    expect(useSimulationStore.getState().country).toBe('USA');

    const typeSelect = screen.getByRole('combobox', { name: /Election Type/i });
    fireEvent.change(typeSelect, { target: { value: 'State' } });
    expect(useSimulationStore.getState().electionType).toBe('State');
  });

  it('navigates through steps to budget and updates sliders', () => {
    render(<SimulationPanel />);
    
    // Go to step 2
    fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
    expect(screen.getByText(/Budget Allocation/i)).toBeInTheDocument();

    const digitalSlider = screen.getByLabelText('Digital Budget');
    fireEvent.change(digitalSlider, { target: { value: '60' } });
    expect(useSimulationStore.getState().budgetSplit.digital).toBe(60);

    const groundSlider = screen.getByLabelText('Ground Budget');
    fireEvent.change(groundSlider, { target: { value: '30' } });
    expect(useSimulationStore.getState().budgetSplit.ground).toBe(30);

    const traditionalSlider = screen.getByLabelText('Traditional Budget');
    fireEvent.change(traditionalSlider, { target: { value: '10' } });
    expect(useSimulationStore.getState().budgetSplit.traditional).toBe(10);
  });

  it('navigates to step 3 and toggles strategies', () => {
    useUIStore.getState().setStep(3);
    render(<SimulationPanel />);
    
    expect(screen.getByText(/Key Strategies/i)).toBeInTheDocument();
    
    const strategyButton = screen.getByText('Welfare Promises');
    fireEvent.click(strategyButton);
    
    expect(useSimulationStore.getState().keyDecisions).toContain('Welfare Promises');
  });

  it('navigates to step 4 and runs simulation', () => {
    useUIStore.getState().setStep(4);
    render(<SimulationPanel />);
    
    expect(screen.getByText(/Ready to Simulate\?/i)).toBeInTheDocument();
    
    const runButton = screen.getByRole('button', { name: /Run AI Simulation/i });
    fireEvent.click(runButton);
    
    // After running, we expect the step to increment and runSimulation to be called (which is mocked)
    expect(useUIStore.getState().currentStep).toBe(5);
  });

  it('can navigate backwards', () => {
    useUIStore.getState().setStep(2);
    render(<SimulationPanel />);
    
    fireEvent.click(screen.getByRole('button', { name: /Go to previous step/i }));
    expect(useUIStore.getState().currentStep).toBe(1);
  });
});
