
import React from 'react';
import { useState, useCallback } from 'react';
import { NNConfigForm } from './NNConfig';
import { NNTrainControls } from './NNTrainControls';
import { NNVisualization } from './NNVisualization';
import { MLP, trainMLP } from './services/mlp';
import type { NNConfig, TrainingProgress } from '../../types';
import { NN_DATASET, NN_INPUT_NEURONS, NN_OUTPUT_NEURONS } from '../../constants';
import { Card } from '../../components/ui/Card';

export const NeuralNetworkPage = () => {
  const [nnConfig, setNnConfig] = useState<NNConfig>({
    learningRate: 0.1,
    epochs: 1000,
    hiddenLayers: [{ neurons: 5, activation: 'sigmoid' }],
  });
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress[]>([]);
  const [mlp, setMlp] = useState<MLP | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [predictions, setPredictions] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("Configure a rede e inicie o treinamento.");

  const handleConfigChange = useCallback((newConfig: Partial<NNConfig>) => {
    setNnConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const handleTrain = useCallback(async () => {
    setIsTraining(true);
    setTrainingProgress([]);
    setPredictions([]);
    setStatusMessage("Inicializando e treinando a rede...");

    const networkStructure = [
        NN_INPUT_NEURONS, 
        ...nnConfig.hiddenLayers.map(l => l.neurons), 
        NN_OUTPUT_NEURONS
    ];
    const activationFunctions = [
        ...nnConfig.hiddenLayers.map(l => l.activation),
        'sigmoid' // Output layer activation
    ];
    
    const newMlp = new MLP(networkStructure, activationFunctions as any); // Cast as any for simplicity here
    setMlp(newMlp);

    const progressData: TrainingProgress[] = [];
    for (let epoch = 0; epoch < nnConfig.epochs; epoch++) {
      const error = trainMLP(newMlp, NN_DATASET, nnConfig.learningRate);
      progressData.push({ epoch: epoch + 1, error });
      if ((epoch + 1) % Math.max(1, Math.floor(nnConfig.epochs / 100)) === 0) { // Update UI periodically
        setStatusMessage(`Treinando Época: ${epoch + 1}/${nnConfig.epochs}, Erro: ${error.toFixed(6)}`);
        setTrainingProgress([...progressData]);
        await new Promise(resolve => setTimeout(resolve, 0)); // Yield to browser
      }
    }
    setTrainingProgress(progressData);
    setIsTraining(false);
    setStatusMessage(`Treinamento completo. Erro final: ${progressData[progressData.length-1]?.error.toFixed(6) || 'N/D'}`);
    
    // Make predictions on the dataset
    const preds: string[] = [];
    NN_DATASET.forEach(data => {
        const output = newMlp.predict(data.input);
        const binaryOutput = output.map(o => (o > 0.5 ? 1 : 0)).join('');
        preds.push(`Entrada: ${data.decimal} -> Previsto: ${binaryOutput} (Bruto: ${output.map(o => o.toFixed(3)).join(', ')})`);
    });
    setPredictions(preds);

  }, [nnConfig]);

  return (
    <div className="space-y-8">
      <Card title="Configuração da Rede Neural (MLP)">
        <p className="mb-4 text-gray-300">
          Esta ferramenta demonstra um Perceptron Multicamadas (MLP) para classificar dígitos de 0 a 7.
          A entrada é um decimal normalizado, e a saída é uma representação binária de 3 bits.
        </p>
        <NNConfigForm config={nnConfig} onConfigChange={handleConfigChange} />
        <NNTrainControls onTrain={handleTrain} isTraining={isTraining} />
         <p className="text-sm text-gray-400 mt-4">{statusMessage}</p>
      </Card>
      
      {(trainingProgress.length > 0 || predictions.length > 0) && (
        <Card title="Resultados do Treinamento e Previsões">
          <NNVisualization trainingProgress={trainingProgress} predictions={predictions} />
        </Card>
      )}
    </div>
  );
};
