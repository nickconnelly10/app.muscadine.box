import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../ErrorBoundary';
import { vi } from 'vitest';


const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Test error');
  return <div>Child content</div>;
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Suppress console.error for cleaner test output
    vi.spyOn(console, 'error').mockImplementation(() => {});
    // Ensure clean DOM
    document.body.innerHTML = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('component exists and can be imported', () => {
    expect(ErrorBoundary).toBeDefined();
    expect(typeof ErrorBoundary).toBe('function');
  });

  it('renders children when no error', () => {
    const { container } = render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );
    
    // Debug logging for CI
    if (process.env.CI) {
      console.log('[CI DEBUG] document.body exists:', !!document.body);
      console.log('[CI DEBUG] container:', container.innerHTML);
      console.log('[CI DEBUG] body innerHTML:', document.body.innerHTML);
    }
    
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders fallback UI when child throws', () => {
    // Suppress the error boundary's console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );
    
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});

