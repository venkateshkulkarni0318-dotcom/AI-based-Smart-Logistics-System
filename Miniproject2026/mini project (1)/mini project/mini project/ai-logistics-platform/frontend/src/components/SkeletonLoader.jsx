import React from 'react';

/**
 * SkeletonLoader Component (Fixes Issue A6)
 * Provides animated placeholders during asynchronous loading.
 */
const SkeletonLoader = ({ height = '20px', width = '100%', borderRadius = '4px', style = {} }) => {
  return (
    <div
      className="skeleton-loader"
      style={{
        height,
        width,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(148, 163, 184, 0.08) 25%, rgba(148, 163, 184, 0.18) 50%, rgba(148, 163, 184, 0.08) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonPulse 1.5s infinite ease-in-out',
        ...style
      }}
      aria-hidden="true"
    />
  );
};

export default SkeletonLoader;
