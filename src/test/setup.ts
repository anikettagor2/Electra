import React from 'react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => React.createElement('div', props, children),
    button: ({ children, ...props }: any) => React.createElement('button', props, children),
  },
  AnimatePresence: ({ children }: any) => children,
}));

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;
