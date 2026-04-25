import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { EVMSimulator } from '@/features/journey/EVMSimulator';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('EVMSimulator Component', () => {
  it('renders all candidates correctly', () => {
    render(<EVMSimulator />);
    expect(screen.getByText(/Progressive Alliance/i)).toBeInTheDocument();
    expect(screen.getByText(/Liberty Front/i)).toBeInTheDocument();
    expect(screen.getByText(/Unity Party/i)).toBeInTheDocument();
    expect(screen.getByText(/Green Future/i)).toBeInTheDocument();
  });

  it('handles the voting process and shows VVPAT slip', async () => {
    vi.useFakeTimers();
    render(<EVMSimulator />);
    
    // Find the vote button for Progressive Alliance
    const voteButtons = screen.getAllByRole('button', { name: /Vote for/i });
    fireEvent.click(voteButtons[0]);
    
    // Check for "Processing Vote" state
    expect(screen.getByText(/Processing Vote/i)).toBeInTheDocument();
    
    // Advance timer for VVPAT slip appearance (800ms)
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    // Check for VVPAT slip content
    const slip = screen.getByTestId('vvpat-slip');
    expect(slip).toHaveTextContent(/Voter Verifiable/i);
    expect(slip).toHaveTextContent(/Paper Audit Trail/i);
    expect(slip).toHaveTextContent(/Progressive Alliance/i);
    
    // Advance timer to complete the cycle (5000ms total)
    await act(async () => {
      vi.advanceTimersByTime(4000);
    });
    
    // Verify system resets
    expect(screen.queryByText(/Processing Vote/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Voter Verifiable Paper Audit Trail/i)).not.toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
