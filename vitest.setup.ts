import '@testing-library/jest-dom';
import React from 'react';

// Ensure React is available globally for JSX and class components
global.React = React;

// Mock window.matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock process.env
Object.defineProperty(process, 'env', {
  value: {
    NODE_ENV: 'test',
  },
  writable: true,
});


