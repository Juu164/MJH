import React from 'react';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary';
}

export const NeonButton: React.FC<Props> = ({ variant = 'primary', className = '', children, ...props }) => {
  const base =
    'px-4 py-2 rounded-lg font-bold transition-transform duration-200 neon-gradient text-white neon-glow';

  return (
    <button className={`${base} hover:scale-105 ${className}`} {...props}>
      {children}
    </button>
  );
};

export default NeonButton;
