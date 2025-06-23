import React from 'react';

interface NeonCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const NeonCard: React.FC<NeonCardProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`bg-dark/60 border border-primary/50 rounded-xl p-4 shadow-neon backdrop-blur-md ${className}`}
      {...props}
    />
  );
};
