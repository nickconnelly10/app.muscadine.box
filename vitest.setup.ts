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

// Ensure document.body and documentElement always exist (critical for CI)
if (!document.body) {
  document.body = document.createElement('body');
  document.documentElement?.appendChild(document.body);
}

if (!document.documentElement) {
  const html = document.createElement('html');
  if (document.body) {
    html.appendChild(document.body);
  }
  Object.defineProperty(document, 'documentElement', {
    value: html,
    writable: false,
    configurable: false
  });
}

// Mock additional browser APIs (needed for CI and some local environments)
if (!window.getComputedStyle || process.env.CI) {
  Object.defineProperty(window, 'getComputedStyle', {
    value: () => ({
      getPropertyValue: () => '',
    }),
  });
}

// Mock ResizeObserver if not available
if (!global.ResizeObserver) {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock IntersectionObserver if not available
if (!global.IntersectionObserver) {
  global.IntersectionObserver = class IntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as any;
}


