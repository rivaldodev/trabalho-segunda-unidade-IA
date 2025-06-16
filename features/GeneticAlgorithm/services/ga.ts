
import type { GAIndividual, GAParams } from '../../../types';
import { GA_VARIABLE_MIN, GA_VARIABLE_MAX, GA_CHROMOSOME_LENGTH } from '../../../constants';

// Helper: Decode binary string to a decimal value for one variable
const binaryToDecimal = (binary: string, min: number, max: number): number => {
  const intValue = parseInt(binary, 2);
  const maxIntValue = Math.pow(2, binary.length) - 1;
  return min + (intValue / maxIntValue) * (max - min);
};

// Fitness function: f(x,y) = abs(e^(-x) - y^2 + 1) + 10^(-4)
// We want to MAXIMIZE this function.
const calculateFitness = (x: number, y: number): number => {
  return Math.abs(Math.exp(-x) - Math.pow(y, 2) + 1) + 0.0001;
};

const createIndividual = (chromosomeLength: number, bitsPerVariable: number): GAIndividual => {
  let chromosome = "";
  for (let i = 0; i < chromosomeLength; i++) {
    chromosome += Math.random() < 0.5 ? "0" : "1";
  }
  const xBin = chromosome.substring(0, bitsPerVariable);
  const yBin = chromosome.substring(bitsPerVariable);
  const x = binaryToDecimal(xBin, GA_VARIABLE_MIN, GA_VARIABLE_MAX);
  const y = binaryToDecimal(yBin, GA_VARIABLE_MIN, GA_VARIABLE_MAX);
  const fitness = calculateFitness(x, y);
  return { chromosome, fitness, x, y };
};

export const initializePopulation = (populationSize: number, chromosomeLength: number): GAIndividual[] => {
  const population: GAIndividual[] = [];
  const bitsPerVariable = GA_CHROMOSOME_LENGTH / 2; // GA_CHROMOSOME_LENGTH is the total length for 2 vars
  for (let i = 0; i < populationSize; i++) {
    population.push(createIndividual(chromosomeLength, bitsPerVariable));
  }
  return population;
};

// Selection: Roulette Wheel
const selectParent = (population: GAIndividual[]): GAIndividual => {
  const totalFitness = population.reduce((sum, ind) => sum + ind.fitness, 0);
  if (totalFitness === 0) { // Avoid division by zero if all fitnesses are 0
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

// Crossover: Single-point
const crossover = (parent1: GAIndividual, parent2: GAIndividual, crossoverRate: number, chromosomeLength: number): GAIndividual[] => {
  if (Math.random() > crossoverRate) {
    return [
      { ...parent1 }, // Return copies
      { ...parent2 }
    ];
  }
  const point = Math.floor(Math.random() * (chromosomeLength -1)) + 1; // Avoid 0 and length
  const child1Chromosome = parent1.chromosome.substring(0, point) + parent2.chromosome.substring(point);
  const child2Chromosome = parent2.chromosome.substring(0, point) + parent1.chromosome.substring(point);
  
  const bitsPerVar = chromosomeLength / 2;
  const child1 = {
    chromosome: child1Chromosome,
    x: binaryToDecimal(child1Chromosome.substring(0, bitsPerVar), GA_VARIABLE_MIN, GA_VARIABLE_MAX),
    y: binaryToDecimal(child1Chromosome.substring(bitsPerVar), GA_VARIABLE_MIN, GA_VARIABLE_MAX),
    fitness: 0
  };
  child1.fitness = calculateFitness(child1.x, child1.y);

  const child2 = {
    chromosome: child2Chromosome,
    x: binaryToDecimal(child2Chromosome.substring(0, bitsPerVar), GA_VARIABLE_MIN, GA_VARIABLE_MAX),
    y: binaryToDecimal(child2Chromosome.substring(bitsPerVar), GA_VARIABLE_MIN, GA_VARIABLE_MAX),
    fitness: 0
  };
  child2.fitness = calculateFitness(child2.x, child2.y);
  
  return [child1, child2];
};

// Mutation: Bit-flip
const mutate = (individual: GAIndividual, mutationRate: number): GAIndividual => {
  let newChromosome = "";
  for (let i = 0; i < individual.chromosome.length; i++) {
    if (Math.random() < mutationRate) {
      newChromosome += individual.chromosome[i] === "0" ? "1" : "0";
    } else {
      newChromosome += individual.chromosome[i];
    }
  }
  if (newChromosome === individual.chromosome) return {...individual}; // No mutation occurred

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

export const runGA = (
  currentPopulation: GAIndividual[],
  params: GAParams
): { newPopulation: GAIndividual[]; bestFitness: number; averageFitness: number; bestIndividual: GAIndividual | null } => {
  
  // Evaluate fitness (already done in individual creation/modification)

  const newPopulation: GAIndividual[] = [];

  // Elitism: Keep the best individual
  currentPopulation.sort((a, b) => b.fitness - a.fitness);
  const bestCurrentIndividual = currentPopulation[0] ? { ...currentPopulation[0] } : null;
  if (bestCurrentIndividual) {
      newPopulation.push(bestCurrentIndividual);
  }
  
  // Fill the rest of the population
  while (newPopulation.length < params.populationSize) {
    const parent1 = selectParent(currentPopulation);
    const parent2 = selectParent(currentPopulation);
    
    let [child1, child2] = crossover(parent1, parent2, params.crossoverRate, params.chromosomeLength);
    
    child1 = mutate(child1, params.mutationRate);
    child2 = mutate(child2, params.mutationRate);
    
    if (newPopulation.length < params.populationSize) newPopulation.push(child1);
    if (newPopulation.length < params.populationSize) newPopulation.push(child2);
  }

  const fitnessValues = newPopulation.map(ind => ind.fitness);
  const bestFitness = Math.max(...fitnessValues);
  const averageFitness = fitnessValues.reduce((sum, fit) => sum + fit, 0) / newPopulation.length;
  
  const overallBestIndividual = newPopulation.reduce((best, current) => (current.fitness > best.fitness ? current : best), newPopulation[0] || null);

  return { newPopulation, bestFitness, averageFitness, bestIndividual: overallBestIndividual };
};
