import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { VoterRegistration } from '@/features/journey/VoterRegistration';

// Mock framer-motion as it can cause issues in JSDOM
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('VoterRegistration Component', () => {
  it('renders the initial step correctly', () => {
    render(<VoterRegistration />);
    expect(screen.getByText(/Voter Identity Verification/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. John Doe/i)).toBeInTheDocument();
  });

  it('allows user to progress through steps', async () => {
    vi.useFakeTimers();
    render(<VoterRegistration />);
    
    // Step 1: Identity
    const nameInput = screen.getByPlaceholderText(/e.g. John Doe/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    const verifyButton = screen.getByText(/Verify Identity/i);
    fireEvent.click(verifyButton);
    
    // Advance timer for step transition
    await act(async () => {
      vi.advanceTimersByTime(1600);
    });
    
    // Step 2: Biometrics
    expect(screen.getByText(/Digital Biometrics/i)).toBeInTheDocument();
    const completeButton = screen.getByText(/Complete Registration/i);
    fireEvent.click(completeButton);
    
    // Advance timer for final transition
    await act(async () => {
      vi.advanceTimersByTime(1600);
    });
    
    // Final Step: Success
    expect(screen.getByText(/Registration Successful/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
