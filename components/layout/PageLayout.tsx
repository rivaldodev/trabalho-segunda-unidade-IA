
import React from 'react';
import { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  children: ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ title, children }) => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-center text-accent mb-8">{title}</h1>
      {children}
    </div>
  );
};
