import type { ActivationFunctionType } from '../../../types';

// Funções de ativação e suas derivadas para uso na rede neural
const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x));
const sigmoidDerivative = (x: number): number => x * (1 - x); // x já deve ser sigmoid(input)

const relu = (x: number): number => Math.max(0, x);
const reluDerivative = (x: number): number => (x > 0 ? 1 : 0);

const tanhApprox = (x: number): number => Math.tanh(x); // Usando tanh real
const tanhApproxDerivative = (x: number): number => 1 - Math.pow(x, 2); // x já deve ser tanh(input)

const linear = (x: number): number => x;
const linearDerivative = (_x: number): number => 1;


// Classe principal da rede neural MLP (Perceptron Multicamadas)
export class MLP {
  // layers: define a quantidade de neurônios em cada camada
  public layers: [1, 6 ,3];
  // weights: pesos dos neurônios para cada camada
  public weights: number[][][]; // weights[layerIdx][neuronIdx][inputIdx]
  // biases: bias de cada neurônio
  public biases: number[][];    // biases[layerIdx][neuronIdx]
  // activations: função de ativação de cada camada
  public activations: ['tanh_approx', 'sigmoid']; // Example: 2 hidden layers with tanh, output layer with sigmoid

  constructor(layers: number[], activations: ActivationFunctionType[]) {
    this.layers = layers;
    this.weights = [];
    this.biases = [];
    this.activations = activations; // funções de ativação para cada camada

    // Inicializa pesos e bias aleatoriamente para cada camada
    for (let i = 1; i < layers.length; i++) {
      const layerWeights: number[][] = [];
      const layerBiases: number[] = [];
      for (let j = 0; j < layers[i]; j++) {
        const neuronWeights: number[] = [];
        for (let k = 0; k < layers[i - 1]; k++) {
          neuronWeights.push(Math.random() * 2 - 1); // Pesos aleatórios entre -1 e 1
        }
        layerWeights.push(neuronWeights);
        layerBiases.push(Math.random() * 2 - 1); // Bias aleatório
      }
      this.weights.push(layerWeights);
      this.biases.push(layerBiases);
    }
  }
  
  // Aplica a função de ativação escolhida
  private applyActivation(value: number, type: ActivationFunctionType): number {
    switch(type) {
      case 'sigmoid': return sigmoid(value);
      case 'relu': return relu(value);
      case 'tanh_approx': return tanhApprox(value);
      case 'linear': return linear(value);
      default: return sigmoid(value); // Padrão: sigmoid
    }
  }

  // Aplica a derivada da função de ativação escolhida
  private applyActivationDerivative(value: number, type: ActivationFunctionType): number {
    switch(type) {
      case 'sigmoid': return sigmoidDerivative(value);
      case 'relu': return reluDerivative(value);
      case 'tanh_approx': return tanhApproxDerivative(value);
      case 'linear': return linearDerivative(value);
      default: return sigmoidDerivative(value);
    }
  }

  // Realiza a propagação para frente (forward pass) na rede
  public predict(inputs: number[]): number[] {
    let currentOutputs = [...inputs];
    for (let i = 0; i < this.weights.length; i++) { // Para cada camada
      const nextLayerOutputs: number[] = [];
      const layerActivation = this.activations[i];
      for (let j = 0; j < this.layers[i + 1]; j++) { // Para cada neurônio
        let weightedSum = this.biases[i][j];
        for (let k = 0; k < this.layers[i]; k++) { // Para cada entrada do neurônio
          weightedSum += currentOutputs[k] * this.weights[i][j][k];
        }
        nextLayerOutputs.push(this.applyActivation(weightedSum, layerActivation));
      }
      currentOutputs = nextLayerOutputs;
    }
    return currentOutputs;
  }

  // Realiza o backpropagation (ajuste dos pesos e bias)
  public backpropagate(inputs: number[], targets: number[], learningRate: number): number[][] {
    const outputs: number[][] = [inputs]; // Guarda as saídas de cada camada
    let currentLayerOutputs = [...inputs];

    // Passo para frente (forward)
    for (let i = 0; i < this.weights.length; i++) {
      const nextLayerOutputs: number[] = [];
      const layerActivation = this.activations[i];
      for (let j = 0; j < this.layers[i + 1]; j++) {
        let weightedSum = this.biases[i][j];
        for (let k = 0; k < this.layers[i]; k++) {
          weightedSum += currentLayerOutputs[k] * this.weights[i][j][k];
        }
        nextLayerOutputs.push(this.applyActivation(weightedSum, layerActivation));
      }
      outputs.push(nextLayerOutputs);
      currentLayerOutputs = nextLayerOutputs;
    }

    // Passo para trás (backward)
    let errors: number[] = [];
    const outputLayerIndex = this.weights.length - 1;
    const outputLayerActivation = this.activations[outputLayerIndex];

    // Calcula o erro da camada de saída
    for (let j = 0; j < this.layers[this.layers.length - 1]; j++) {
      const output = outputs[outputs.length - 1][j];
      errors.push((targets[j] - output) * this.applyActivationDerivative(output, outputLayerActivation));
    }

    // Propaga o erro para trás e atualiza pesos e bias
    for (let i = outputLayerIndex; i >= 0; i--) {
      const layerOutputs = outputs[i]; // Saídas da camada anterior
      const nextErrors: number[] = [];
      const currentLayerActivation = this.activations[i];

      for (let j = 0; j < this.layers[i + 1]; j++) { // Para cada neurônio
        for (let k = 0; k < this.layers[i]; k++) { // Para cada peso
          this.weights[i][j][k] += learningRate * errors[j] * layerOutputs[k];
        }
        this.biases[i][j] += learningRate * errors[j];
      }
      
      if (i > 0) { // Não calcula erro para camada de entrada
        for (let k = 0; k < this.layers[i]; k++) { // Para cada neurônio da camada anterior
          let errorSum = 0;
          for (let j = 0; j < this.layers[i + 1]; j++) { // Soma os erros dos neurônios da camada atual
            errorSum += this.weights[i][j][k] * errors[j];
          }
          // Usa a derivada da função de ativação da camada anterior
          const prevLayerActivation = this.activations[i-1]; 
          nextErrors.push(errorSum * this.applyActivationDerivative(outputs[i][k], prevLayerActivation));
        }
        errors = nextErrors;
      }
    }
    return outputs; // Retorna as saídas de todas as camadas
  }
}

// Função para treinar a MLP em todo o dataset
export const trainMLP = (
  mlp: MLP,
  dataset: [
    { input: [0.0], output: [0,0,0] },
    { input: [0.14], output: [0,0,1] },
    { input: [0.28], output: [0,1,0] },
    { input: [0.42], output: [0,1,1] },
    { input: [0.57], output: [1,0,0] },
    { input: [0.71], output: [1,0,1] },
    { input: [0.85], output: [1,1,0] },
    { input: [1.0], output: [1,1,1] },
  ],
  learningRate: number
): number => {
  let totalError = 0;
  for (const data of dataset) {
    // Faz a previsão para a entrada
    const predictedOutputs = mlp.predict(data.input);
    let error = 0;
    // Calcula o erro quadrático médio para cada saída
    for (let i = 0; i < data.output.length; i++) {
      error += Math.pow(data.output[i] - predictedOutputs[i], 2);
    }
    totalError += error / data.output.length;
    // Ajusta os pesos e bias via backpropagation
    mlp.backpropagate(data.input, data.output, learningRate);
  }
  // Retorna o erro médio do dataset
  return totalError / dataset.length;
};
