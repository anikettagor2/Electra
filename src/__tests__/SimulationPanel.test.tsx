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

describe('SimulationPanel', () => {
  beforeEach(() => {
    useUIStore.getState().resetStep();
    useSimulationStore.getState().reset();
  });

  it('renders the initial step correctly', () => {
    render(<SimulationPanel />);
    expect(screen.getByText(/Setup Election Scenario/i)).toBeInTheDocument();
  });

  it('navigates to next step on button click', async () => {
    render(<SimulationPanel />);
    const nextButton = screen.getByRole('button', { name: /Next Step/i });
    fireEvent.click(nextButton);
    expect(screen.getByText(/Budget Allocation/i)).toBeInTheDocument();
  });

  it('allows selecting country', () => {
    render(<SimulationPanel />);
    const select = screen.getByRole('combobox', { name: /Country/i });
    fireEvent.change(select, { target: { value: 'USA' } });
    expect(useSimulationStore.getState().country).toBe('USA');
  });
});
