
import React from 'react';
import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className }) => {
  return (
    <div className={`bg-neutral-dark shadow-xl rounded-lg p-6 ${className}`}>
      {title && <h2 className="text-2xl font-semibold text-accent mb-4">{title}</h2>}
      {children}
    </div>
  );
};
