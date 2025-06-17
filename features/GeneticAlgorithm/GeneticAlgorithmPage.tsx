import React from 'react';
import { useState, useCallback } from 'react';
import { GAParamsForm } from './GAParameters';
import { GAResults } from './GAResults';
import { runGA, initializePopulation } from './services/ga';
import type { GAParams, GAIndividual, GAIterationResult } from '../../types';
import { GA_CHROMOSOME_LENGTH, GA_BITS_PER_VARIABLE, GA_VARIABLE_MIN, GA_VARIABLE_MAX, GA_FUNCTION_TEXT } from '../../constants';
import { Card } from '../../components/ui/Card';

// Componente principal da página do Algoritmo Genético
export const GeneticAlgorithmPage = () => {
  // Estado para armazenar os parâmetros do algoritmo genético
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
  // Estado para armazenar os resultados de cada geração
  const [results, setResults] = useState<GAIterationResult[]>([]);
  // Estado para armazenar o melhor indivíduo encontrado
  const [bestIndividual, setBestIndividual] = useState<GAIndividual | null>(null);
  // Estado para indicar se o algoritmo está executando
  const [isRunning, setIsRunning] = useState(false);
  // Estado para exibir mensagens de status
  const [statusMessage, setStatusMessage] = useState<string>("Pronto para começar.");

  // Função para atualizar os parâmetros do algoritmo
  const handleParamsChange = useCallback((newParams: Partial<GAParams>) => {
    setParams(prev => ({ ...prev, ...newParams }));
  }, []);

  // Função principal que executa o algoritmo genético
  const startAlgorithm = useCallback(async () => {
    setIsRunning(true);
    setResults([]); // Limpa resultados anteriores
    setBestIndividual(null); // Limpa melhor indivíduo anterior
    setStatusMessage("Inicializando população...");

    // Cria a população inicial com indivíduos aleatórios
    let population = initializePopulation(params.populationSize, params.chromosomeLength);
    const iterationResults: GAIterationResult[] = [];

    // Executa o algoritmo por um número específico de gerações
    for (let i = 0; i < params.generations; i++) {
      setStatusMessage(`Executando geração ${i + 1} de ${params.generations}...`);
      // Permite que o navegador atualize a interface entre gerações
      await new Promise(resolve => setTimeout(resolve, 0)); 
      
      // Executa uma geração do algoritmo genético
      const result = runGA(population, params);
      population = result.newPopulation; // Atualiza a população
      
      // Armazena os resultados da geração
      iterationResults.push({
        generation: i + 1,
        bestFitness: result.bestFitness,
        averageFitness: result.averageFitness,
        bestIndividual: result.bestIndividual,
      });
      
      setResults([...iterationResults]); // Atualiza os resultados na interface
      
      // Atualiza o melhor indivíduo se necessário
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
      {/* Card para configuração dos parâmetros do algoritmo */}
      <Card title="Configuração do Algoritmo Genético">
        <p className="mb-4 text-gray-300">
          Esta ferramenta demonstra um Algoritmo Genético para encontrar o máximo da função:
          <strong className="text-accent ml-1">{GA_FUNCTION_TEXT}</strong>.
          Ajuste os parâmetros abaixo e execute o algoritmo.
        </p>
        {/* Formulário para configurar parâmetros e botão para iniciar */}
        <GAParamsForm params={params} onParamsChange={handleParamsChange} onStart={startAlgorithm} isRunning={isRunning} />
      </Card>
      
      {/* Card para exibir status e resultados do algoritmo */}
      <Card title="Status e Resultados do Algoritmo" className={isRunning || results.length > 0 ? 'block' : 'hidden'}>
         <p className="text-sm text-gray-400 mb-4">{statusMessage}</p>
        {/* Componente que exibe gráficos e melhor solução */}
        <GAResults results={results} bestIndividual={bestIndividual} />
      </Card>
    </div>
  );
};
