
import React from 'react';
import { useState, useCallback } from 'react';
import { GAParamsForm } from './GAParameters';
import { GAResults } from './GAResults';
import { runGA, initializePopulation } from './services/ga';
import type { GAParams, GAIndividual, GAIterationResult } from '../../types';
import { GA_CHROMOSOME_LENGTH, GA_BITS_PER_VARIABLE, GA_VARIABLE_MIN, GA_VARIABLE_MAX, GA_FUNCTION_TEXT } from '../../constants';
import { Card } from '../../components/ui/Card';

export const GeneticAlgorithmPage = () => {
  const [params, setParams] = useState<GAParams>({
    populationSize: 100,
    mutationRate: 0.05,
    crossoverRate: 0.8,
    generations: 200,
    chromosomeLength: GA_CHROMOSOME_LENGTH,
    bitsPerVariable: GA_BITS_PER_VARIABLE,
    geneMin: GA_VARIABLE_MIN,
    geneMax: GA_VARIABLE_MAX,
  });
  const [results, setResults] = useState<GAIterationResult[]>([]);
  const [bestIndividual, setBestIndividual] = useState<GAIndividual | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("Pronto para começar.");

  const handleParamsChange = useCallback((newParams: Partial<GAParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  const startAlgorithm = useCallback(async () => {
    setIsRunning(true);
    setResults([]);
    setBestIndividual(null);
    setStatusMessage("Inicializando população...");

    let population = initializePopulation(params.populationSize, params.chromosomeLength);
    const iterationResults: GAIterationResult[] = [];

    for (let i = 0; i < params.generations; i++) {
      setStatusMessage(`Executando geração ${i + 1} de ${params.generations}...`);
      // Yield to the browser to prevent freezing for long computations
      await new Promise(resolve => setTimeout(resolve, 0)); 
      
      const result = runGA(population, params);
      population = result.newPopulation;
      iterationResults.push({
        generation: i + 1,
        bestFitness: result.bestFitness,
        averageFitness: result.averageFitness,
        bestIndividual: result.bestIndividual,
      });
      setResults([...iterationResults]);
      if (result.bestIndividual) {
        if (!bestIndividual || result.bestIndividual.fitness > bestIndividual.fitness) {
          setBestIndividual(result.bestIndividual);
        }
      }
    }
    setIsRunning(false);
    setStatusMessage(`Finalizadas ${params.generations} gerações.`);
  }, [params, bestIndividual]);

  return (
    <div className="space-y-8">
      <Card title="Configuração do Algoritmo Genético">
        <p className="mb-4 text-gray-300">
          Esta ferramenta demonstra um Algoritmo Genético para encontrar o máximo da função:
          <strong className="text-accent ml-1">{GA_FUNCTION_TEXT}</strong>.
          Ajuste os parâmetros abaixo e execute o algoritmo.
        </p>
        <GAParamsForm params={params} onParamsChange={handleParamsChange} onStart={startAlgorithm} isRunning={isRunning} />
      </Card>
      
      <Card title="Status e Resultados do Algoritmo" className={isRunning || results.length > 0 ? 'block' : 'hidden'}>
         <p className="text-sm text-gray-400 mb-4">{statusMessage}</p>
        <GAResults results={results} bestIndividual={bestIndividual} />
      </Card>
    </div>
  );
};
