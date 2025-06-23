import React from 'react';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const NeonButton: React.FC<NeonButtonProps> = ({ className = '', ...props }) => {
  const base =
    'px-4 py-2 rounded-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-accent transition';
  const gradient =
    'bg-gradient-to-r from-primary via-accent to-primary neon-gradient shadow-neon hover:opacity-90';
  return <button className={`${base} ${gradient} ${className}`} {...props} />;
};
