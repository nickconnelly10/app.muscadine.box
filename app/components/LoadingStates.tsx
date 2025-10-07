"use client";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses[size]}`} />
      {text && (
        <p className="mt-2 text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
}

interface LoadingStateProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  text?: string;
}

export function LoadingState({ isLoading, children, fallback, text = 'Loading...' }: LoadingStateProps) {
  if (isLoading) {
    return fallback || <LoadingSpinner text={text} className="py-8" />;
  }
  return <>{children}</>;
}

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded mb-2"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

export function VaultSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div>
            <Skeleton className="w-20 h-5 mb-1" />
            <Skeleton className="w-16 h-4" />
          </div>
        </div>
        <div className="text-right">
          <Skeleton className="w-24 h-6 mb-1" />
          <Skeleton className="w-20 h-4" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Skeleton className="w-16 h-5 mb-1 mx-auto" />
          <Skeleton className="w-12 h-4 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="w-16 h-5 mb-1 mx-auto" />
          <Skeleton className="w-12 h-4 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="w-16 h-5 mb-1 mx-auto" />
          <Skeleton className="w-12 h-4 mx-auto" />
        </div>
      </div>
    </div>
  );
}
