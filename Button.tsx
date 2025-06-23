import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  className = '',
  ...props
}) => {
  const base =
    'px-4 py-2 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-accent';
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-gray-200 text-dark hover:bg-gray-300',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props} />
  );
};
