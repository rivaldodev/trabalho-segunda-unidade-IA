
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { GeneticAlgorithmPage } from './features/GeneticAlgorithm/GeneticAlgorithmPage';
import { NeuralNetworkPage } from './features/NeuralNetwork/NeuralNetworkPage';
import { AIAssistantPage } from './features/AIAssistant/AIAssistantPage';
import { PageLayout } from './components/layout/PageLayout';

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background-dark text-neutral-light">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<PageLayout title="Demonstração de Algoritmo Genético"><GeneticAlgorithmPage /></PageLayout>} />
          <Route path="/neural-network" element={<PageLayout title="Demonstração de Rede Neural (MLP)"><NeuralNetworkPage /></PageLayout>} />
          <Route path="/ai-assistant" element={<PageLayout title="Assistente de IA (API Gemini)"><AIAssistantPage /></PageLayout>} />
        </Routes>
      </main>
      <footer className="text-center py-4 border-t border-gray-700 text-sm text-gray-400">
        Playground de Algoritmos de IA - Projeto de IA
      </footer>
    </div>
  );
};

export default App;
