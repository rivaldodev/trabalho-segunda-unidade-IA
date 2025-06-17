import type { GAIndividual, GAParams } from '../../../types';
import { GA_VARIABLE_MIN, GA_VARIABLE_MAX, GA_CHROMOSOME_LENGTH } from '../../../constants';

// Função auxiliar: Converte string binária para valor decimal
const binaryToDecimal = (binary: string, min: number, max: number): number => {
  const intValue = parseInt(binary, 2);
  const maxIntValue = Math.pow(2, binary.length) - 1;
  return min + (intValue / maxIntValue) * (max - min);
};

// Função de aptidão: f(x,y) = abs(e^(-x) - y^2 + 1) + 10^(-4)
const calculateFitness = (x: number, y: number): number => {
  return Math.abs(Math.exp(-x) - Math.pow(y, 2) + 1) + 0.0001;
};

// Cria um indivíduo com cromossomo aleatório
const createIndividual = (chromosomeLength: number, bitsPerVariable: number): GAIndividual => {
  let chromosome = "";
  // Gera uma string binária aleatória
  for (let i = 0; i < chromosomeLength; i++) {
    chromosome += Math.random() < 0.5 ? "0" : "1";
  }
  // Decodifica os valores de x e y a partir do cromossomo
  const xBin = chromosome.substring(0, bitsPerVariable);
  const yBin = chromosome.substring(bitsPerVariable);
  const x = binaryToDecimal(xBin, GA_VARIABLE_MIN, GA_VARIABLE_MAX);
  const y = binaryToDecimal(yBin, GA_VARIABLE_MIN, GA_VARIABLE_MAX);
  const fitness = calculateFitness(x, y);
  return { chromosome, fitness, x, y };
};

// Inicializa a população com indivíduos aleatórios
export const initializePopulation = (populationSize: number, chromosomeLength: number): GAIndividual[] => {
  const population: GAIndividual[] = [];
  const bitsPerVariable = GA_CHROMOSOME_LENGTH / 2; // Metade dos bits para cada variável (x e y)
  for (let i = 0; i < populationSize; i++) {
    population.push(createIndividual(chromosomeLength, bitsPerVariable));
  }
  return population;
};

// Seleção: Roleta Viciada (Roulette Wheel)
// Indivíduos com maior fitness têm mais chance de serem selecionados
// Maior fitness significa maior probabilidade de ser escolhido
const selectParent = (population: GAIndividual[]): GAIndividual => {
  const totalFitness = population.reduce((sum, ind) => sum + ind.fitness, 0);
  if (totalFitness === 0) { // Evita divisão por zero se todos os fitness forem 0
    return population[Math.floor(Math.random() * population.length)];
  }
  let randomPoint = Math.random() * totalFitness;
  for (const individual of population) {
    randomPoint -= individual.fitness;
    if (randomPoint <= 0) {
      return individual;
    }
  }
  return population[population.length - 1]; // Fallback
};

// Crossover: Ponto único
// Combina partes dos cromossomos dos pais para gerar filhos
const crossover = (parent1: GAIndividual, parent2: GAIndividual, crossoverRate: number, chromosomeLength: number): GAIndividual[] => {
  if (Math.random() > crossoverRate) {
    // Se não há crossover, retorna cópias dos pais
    return [
      { ...parent1 }, 
      { ...parent2 }
    ];
  }
  // Escolhe um ponto de corte aleatório
  const point = Math.floor(Math.random() * (chromosomeLength -1)) + 1; 
  // Cria os cromossomos dos filhos trocando as partes
  const child1Chromosome = parent1.chromosome.substring(0, point) + parent2.chromosome.substring(point);
  const child2Chromosome = parent2.chromosome.substring(0, point) + parent1.chromosome.substring(point);
  
  const bitsPerVar = chromosomeLength / 2;
  // Cria o primeiro filho
  const child1 = {
    chromosome: child1Chromosome,
    x: binaryToDecimal(child1Chromosome.substring(0, bitsPerVar), GA_VARIABLE_MIN, GA_VARIABLE_MAX),
    y: binaryToDecimal(child1Chromosome.substring(bitsPerVar), GA_VARIABLE_MIN, GA_VARIABLE_MAX),
    fitness: 0
  };
  child1.fitness = calculateFitness(child1.x, child1.y);

  // Cria o segundo filho
  const child2 = {
    chromosome: child2Chromosome,
    x: binaryToDecimal(child2Chromosome.substring(0, bitsPerVar), GA_VARIABLE_MIN, GA_VARIABLE_MAX),
    y: binaryToDecimal(child2Chromosome.substring(bitsPerVar), GA_VARIABLE_MIN, GA_VARIABLE_MAX),
    fitness: 0
  };
  child2.fitness = calculateFitness(child2.x, child2.y);
  
  return [child1, child2];
};

// Mutação: Troca de bits (bit-flip)
// Inverte alguns bits do cromossomo com base na taxa de mutação
const mutate = (individual: GAIndividual, mutationRate: number): GAIndividual => {
  let newChromosome = "";
  // Para cada bit do cromossomo
  for (let i = 0; i < individual.chromosome.length; i++) {
    if (Math.random() < mutationRate) {
      // Inverte o bit (0 vira 1, 1 vira 0)
      newChromosome += individual.chromosome[i] === "0" ? "1" : "0";
    } else {
      // Mantém o bit original
      newChromosome += individual.chromosome[i];
    }
  }
  if (newChromosome === individual.chromosome) return {...individual}; // Nenhuma mutação ocorreu

  // Recalcula x, y e fitness do indivíduo mutado
  const bitsPerVar = individual.chromosome.length / 2;
  const mutatedIndividual = {
    chromosome: newChromosome,
    x: binaryToDecimal(newChromosome.substring(0, bitsPerVar), GA_VARIABLE_MIN, GA_VARIABLE_MAX),
    y: binaryToDecimal(newChromosome.substring(bitsPerVar), GA_VARIABLE_MIN, GA_VARIABLE_MAX),
    fitness: 0
  };
  mutatedIndividual.fitness = calculateFitness(mutatedIndividual.x, mutatedIndividual.y);
  return mutatedIndividual;
};

// Executa uma geração do algoritmo genético
export const runGA = (
  currentPopulation: GAIndividual[],
  params: GAParams
): { newPopulation: GAIndividual[]; bestFitness: number; averageFitness: number; bestIndividual: GAIndividual | null } => {
  
  const newPopulation: GAIndividual[] = [];

  // Elitismo: Mantém o melhor indivíduo da geração anterior
  currentPopulation.sort((a, b) => b.fitness - a.fitness);
  const bestCurrentIndividual = currentPopulation[0] ? { ...currentPopulation[0] } : null;
  if (bestCurrentIndividual) {
      newPopulation.push(bestCurrentIndividual);
  }
  
  // Preenche o resto da população através de seleção, crossover e mutação
  while (newPopulation.length < params.populationSize) {
    const parent1 = selectParent(currentPopulation);
    const parent2 = selectParent(currentPopulation);
    
    let [child1, child2] = crossover(parent1, parent2, params.crossoverRate, params.chromosomeLength);
    
    // Aplica mutação nos filhos
    child1 = mutate(child1, params.mutationRate);
    child2 = mutate(child2, params.mutationRate);
    
    // Adiciona os filhos à nova população (se houver espaço)
    if (newPopulation.length < params.populationSize) newPopulation.push(child1);
    if (newPopulation.length < params.populationSize) newPopulation.push(child2);
  }

  // Calcula estatísticas da geração
  const fitnessValues = newPopulation.map(ind => ind.fitness);
  const bestFitness = Math.max(...fitnessValues);
  const averageFitness = fitnessValues.reduce((sum, fit) => sum + fit, 0) / newPopulation.length;
  
  // Encontra o melhor indivíduo da nova população
  const overallBestIndividual = newPopulation.reduce((best, current) => (current.fitness > best.fitness ? current : best), newPopulation[0] || null);

  return { newPopulation, bestFitness, averageFitness, bestIndividual: overallBestIndividual };
};
