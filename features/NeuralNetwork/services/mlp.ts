
import type { ActivationFunctionType } from '../../../types';

// Activation functions and their derivatives
const sigmoid = (x: number): number => 1 / (1 + Math.exp(-x));
const sigmoidDerivative = (x: number): number => x * (1 - x); // Assumes x is already sigmoid(input)

const relu = (x: number): number => Math.max(0, x);
const reluDerivative = (x: number): number => (x > 0 ? 1 : 0);

// Simplified Tanh for stability, real tanh can be Math.tanh
const tanhApprox = (x: number): number => Math.tanh(x); // Using Math.tanh directly
const tanhApproxDerivative = (x: number): number => 1 - Math.pow(x, 2); // Assumes x is already tanh(input)

const linear = (x: number): number => x;
const linearDerivative = (_x: number): number => 1;


export class MLP {
  // public layers: number[];
  public layers: [1, 6 ,3];
  public weights: number[][][]; // weights[layerIdx][neuronIdx][inputIdx]
  public biases: number[][];    // biases[layerIdx][neuronIdx]
  // public activations: ActivationFunctionType[]; // activation function per layer (output layer of previous)
  public activations: ['tanh_approx', 'sigmoid']; // Example: 2 hidden layers with tanh, output layer with sigmoid

  constructor(layers: number[], activations: ActivationFunctionType[]) {
    this.layers = layers;
    this.weights = [];
    this.biases = [];
    this.activations = activations; // activations for hidden layers + output layer

    // Initialize weights and biases
    for (let i = 1; i < layers.length; i++) {
      const layerWeights: number[][] = [];
      const layerBiases: number[] = [];
      for (let j = 0; j < layers[i]; j++) {
        const neuronWeights: number[] = [];
        for (let k = 0; k < layers[i - 1]; k++) {
          neuronWeights.push(Math.random() * 2 - 1); // Random weights between -1 and 1
        }
        layerWeights.push(neuronWeights);
        layerBiases.push(Math.random() * 2 - 1); // Random bias
      }
      this.weights.push(layerWeights);
      this.biases.push(layerBiases);
    }
  }
  
  private applyActivation(value: number, type: ActivationFunctionType): number {
    switch(type) {
      case 'sigmoid': return sigmoid(value);
      case 'relu': return relu(value);
      case 'tanh_approx': return tanhApprox(value);
      case 'linear': return linear(value);
      default: return sigmoid(value); // Default to sigmoid
    }
  }

  private applyActivationDerivative(value: number, type: ActivationFunctionType): number {
     switch(type) {
      case 'sigmoid': return sigmoidDerivative(value);
      case 'relu': return reluDerivative(value);
      case 'tanh_approx': return tanhApproxDerivative(value);
      case 'linear': return linearDerivative(value);
      default: return sigmoidDerivative(value);
    }
  }


  public predict(inputs: number[]): number[] {
    let currentOutputs = [...inputs];
    for (let i = 0; i < this.weights.length; i++) { // For each layer (starting from first hidden)
      const nextLayerOutputs: number[] = [];
      const layerActivation = this.activations[i];
      for (let j = 0; j < this.layers[i + 1]; j++) { // For each neuron in this layer
        let weightedSum = this.biases[i][j];
        for (let k = 0; k < this.layers[i]; k++) { // For each input to this neuron
          weightedSum += currentOutputs[k] * this.weights[i][j][k];
        }
        nextLayerOutputs.push(this.applyActivation(weightedSum, layerActivation));
      }
      currentOutputs = nextLayerOutputs;
    }
    return currentOutputs;
  }

  public backpropagate(inputs: number[], targets: number[], learningRate: number): number[][] {
    const outputs: number[][] = [inputs]; // Store outputs of each layer
    let currentLayerOutputs = [...inputs];

    // Forward pass
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

    // Backward pass
    let errors: number[] = [];
    const outputLayerIndex = this.weights.length - 1;
    const outputLayerActivation = this.activations[outputLayerIndex];

    // Calculate output layer errors
    for (let j = 0; j < this.layers[this.layers.length - 1]; j++) {
      const output = outputs[outputs.length - 1][j];
      errors.push((targets[j] - output) * this.applyActivationDerivative(output, outputLayerActivation));
    }

    // Propagate errors backwards and update weights
    for (let i = outputLayerIndex; i >= 0; i--) {
      const layerOutputs = outputs[i]; // Outputs of the previous layer (inputs to current weight layer)
      const nextErrors: number[] = [];
      const currentLayerActivation = this.activations[i];


      for (let j = 0; j < this.layers[i + 1]; j++) { // For each neuron in current layer (from output perspective)
        for (let k = 0; k < this.layers[i]; k++) { // For each weight connecting to this neuron
          this.weights[i][j][k] += learningRate * errors[j] * layerOutputs[k];
        }
        this.biases[i][j] += learningRate * errors[j];
      }
      
      if (i > 0) { // Don't calculate errors for input layer
        for (let k = 0; k < this.layers[i]; k++) { // For each neuron in the previous layer
          let errorSum = 0;
          for (let j = 0; j < this.layers[i + 1]; j++) { // Sum errors from neurons in current layer
            errorSum += this.weights[i][j][k] * errors[j];
          }
          // The activation function to use for derivative is of the *previous* layer's output
          const prevLayerActivation = this.activations[i-1]; 
          nextErrors.push(errorSum * this.applyActivationDerivative(outputs[i][k], prevLayerActivation));
        }
        errors = nextErrors;
      }
    }
    return outputs; // Return all layer outputs for inspection if needed
  }
}

export const trainMLP = (
  mlp: MLP,
  // dataset: { input: number[]; output: number[] }[],
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
    const predictedOutputs = mlp.predict(data.input);
    let error = 0;
    for (let i = 0; i < data.output.length; i++) {
      error += Math.pow(data.output[i] - predictedOutputs[i], 2);
    }
    totalError += error / data.output.length;
    mlp.backpropagate(data.input, data.output, learningRate);
  }
  return totalError / dataset.length;
};
