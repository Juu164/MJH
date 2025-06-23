import React from 'react';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const NeonCard: React.FC<Props> = ({ children, className = '', ...props }) => (
  <div
    className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg transition-all relative overflow-hidden ${className}`}
    {...props}
  >
    {children}
    <div className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity animate-gradient bg-gradient-to-r from-neonFrom to-neonTo" />
  </div>
);

export default NeonCard;
