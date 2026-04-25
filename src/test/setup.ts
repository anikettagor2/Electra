import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => React.createElement('div', props, children),
    button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => React.createElement('button', props, children),
  },
  AnimatePresence: ({ children }: React.PropsWithChildren<unknown>) => children,
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;
