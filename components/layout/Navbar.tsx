
import React from 'react';
import { NavLink } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out ${
      isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <nav className="bg-neutral-dark shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-xl text-accent">Playground IA</span>
          </div>
          <div className="flex space-x-4">
            <NavLink to="/" className={navLinkClasses}>
              Algoritmo Genético
            </NavLink>
            <NavLink to="/neural-network" className={navLinkClasses}>
              Rede Neural
            </NavLink>
            <NavLink to="/ai-assistant" className={navLinkClasses}>
              Assistente AI
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};
