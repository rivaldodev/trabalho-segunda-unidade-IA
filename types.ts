// Tipos para Algoritmo Genético
export interface GAIndividual {
  chromosome: string; // Cromossomo em string binária
  fitness: number;    // Valor de aptidão
  x: number;          // Valor de x decodificado
  y: number;          // Valor de y decodificado
}

export interface GAParams {
  populationSize: number;    // Tamanho da população
  mutationRate: number;      // Taxa de mutação
  crossoverRate: number;     // Taxa de crossover
  generations: number;       // Número de gerações
  chromosomeLength: number;  // Total de bits para x e y
  bitsPerVariable: number;   // Bits para cada variável (x ou y)
  geneMin: number;           // Valor mínimo do gene
  geneMax: number;           // Valor máximo do gene
}

export interface GAIterationResult {
  generation: number;        // Geração atual
  bestFitness: number;       // Melhor fitness da geração
  averageFitness: number;    // Fitness médio
  bestIndividual: GAIndividual | null; // Melhor indivíduo
}

// Tipos para Rede Neural
export interface NNLayerConfig {
  neurons: number;                   // Número de neurônios na camada
  activation: ActivationFunctionType; // Função de ativação (ex: 'sigmoid', 'relu')
}

export interface NNConfig {
  learningRate: number;               // Taxa de aprendizado
  epochs: number;                     // Número de épocas
  hiddenLayers: NNLayerConfig[];      // Configuração das camadas ocultas
}

export type ActivationFunctionType = 'sigmoid' | 'relu' | 'linear' | 'tanh_approx';

export interface TrainingProgress {
  epoch: number;                      // Época do treinamento
  error: number;                      // Erro médio
}

// Tipos para API Gemini
export interface GeminiMessage {
  role: 'user' | 'model';             // Quem enviou a mensagem
  text: string;                       // Texto da mensagem
  timestamp: number;                  // Momento do envio
}
