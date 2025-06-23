import React from 'react';

interface NeonBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'primary' | 'accent' | 'success';
}

export const NeonBadge: React.FC<NeonBadgeProps> = ({
  color = 'primary',
  className = '',
  ...props
}) => {
  const colors = {
    primary: 'bg-primary/20 text-primary',
    accent: 'bg-accent/20 text-accent',
    success: 'bg-success/20 text-success',
  };
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[color]} ${className}`}
      {...props}
    />
  );
};
