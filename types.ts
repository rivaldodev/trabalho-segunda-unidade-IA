
// Genetic Algorithm Types
export interface GAIndividual {
  chromosome: string; // Binary string
  fitness: number;
  x: number;
  y: number;
}

export interface GAParams {
  populationSize: number;
  mutationRate: number;
  crossoverRate: number;
  generations: number;
  chromosomeLength: number; // Total bits for x and y
  bitsPerVariable: number;   // Bits for one variable (x or y)
  geneMin: number;
  geneMax: number;
}

export interface GAIterationResult {
  generation: number;
  bestFitness: number;
  averageFitness: number;
  bestIndividual: GAIndividual | null;
}

// Neural Network Types
export interface NNLayerConfig {
  neurons: number;
  activation: ActivationFunctionType; // e.g., 'sigmoid', 'relu'
}

export interface NNConfig {
  learningRate: number;
  epochs: number;
  hiddenLayers: NNLayerConfig[];
}

export type ActivationFunctionType = 'sigmoid' | 'relu' | 'linear' | 'tanh_approx';

export interface TrainingProgress {
  epoch: number;
  error: number;
}

// Gemini API Types
export interface GeminiMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
