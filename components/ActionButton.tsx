
import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold text-white bg-brand-primary rounded-full shadow-lg
                 hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary focus:ring-offset-base-100
                 transition-all duration-300 ease-in-out transform hover:scale-105
                 disabled:bg-base-300 disabled:cursor-not-allowed disabled:scale-100"
    >
      {children}
    </button>
  );
};
