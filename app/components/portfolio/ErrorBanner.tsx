"use client";
import React from 'react';

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export default function ErrorBanner({ 
  message, 
  onRetry, 
  dismissible = true,
  onDismiss 
}: ErrorBannerProps) {
  const [visible, setVisible] = React.useState(true);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  return (
    <div style={{
      padding: '1rem 1.5rem',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      marginBottom: '1rem',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        flex: 1,
      }}>
        <span style={{ fontSize: '1.25rem' }}>⚠️</span>
        <div>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#991b1b',
            marginBottom: '0.25rem',
          }}>
            Error
          </div>
          <div style={{
            fontSize: '0.875rem',
            color: '#991b1b',
          }}>
            {message}
          </div>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '0.5rem',
      }}>
        {onRetry && (
          <button
            onClick={onRetry}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          >
            Retry
          </button>
        )}
        
        {dismissible && (
          <button
            onClick={handleDismiss}
            style={{
              padding: '0.5rem',
              backgroundColor: 'transparent',
              color: '#991b1b',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1.25rem',
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}

