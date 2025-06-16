import React from 'react';
import { useState, useCallback } from 'react';
import { NNConfigForm } from './NNConfig';
import { NNTrainControls } from './NNTrainControls';
import { NNVisualization } from './NNVisualization';
import { MLP, trainMLP } from './services/mlp';
import type { NNConfig, TrainingProgress } from '../../types';
import { NN_DATASET, NN_INPUT_NEURONS, NN_OUTPUT_NEURONS } from '../../constants';
import { Card } from '../../components/ui/Card';

// Componente principal da página de Rede Neural
export const NeuralNetworkPage = () => {
  // Estado para configuração da rede neural (taxa de aprendizado, épocas, camadas ocultas)
  const [nnConfig, setNnConfig] = useState<NNConfig>({
    learningRate: 0.1,
    epochs: 1000,
    hiddenLayers: [{ neurons: 5, activation: 'sigmoid' }],
  });
  // Estado para armazenar o progresso do treinamento (erro por época)
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress[]>([]);
  // Estado para armazenar a instância da rede neural MLP
  const [mlp, setMlp] = useState<MLP | null>(null);
  // Estado para indicar se está treinando
  const [isTraining, setIsTraining] = useState(false);
  // Estado para armazenar as previsões após o treinamento
  const [predictions, setPredictions] = useState<string[]>([]);
  // Estado para mensagens de status exibidas ao usuário
  const [statusMessage, setStatusMessage] = useState<string>("Configure a rede e inicie o treinamento.");

  // Função para atualizar a configuração da rede neural ao alterar o formulário
  const handleConfigChange = useCallback((newConfig: Partial<NNConfig>) => {
    setNnConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // Função para iniciar o treinamento da rede neural
  const handleTrain = useCallback(async () => {
    setIsTraining(true); // Indica que o treinamento começou
    setTrainingProgress([]); // Limpa progresso anterior
    setPredictions([]); // Limpa previsões anteriores
    setStatusMessage("Inicializando e treinando a rede...");

    // Monta a estrutura da rede neural (quantidade de neurônios por camada)
    const networkStructure = [
        NN_INPUT_NEURONS, 
        ...nnConfig.hiddenLayers.map(l => l.neurons), 
        NN_OUTPUT_NEURONS
    ];
    // Define as funções de ativação para cada camada
    const activationFunctions = [
        ...nnConfig.hiddenLayers.map(l => l.activation),
        'sigmoid' // Função de ativação da camada de saída
    ];
    
    // Cria uma nova instância da MLP com a estrutura definida
    const newMlp = new MLP(networkStructure, activationFunctions as any); 
    setMlp(newMlp);

    // Array para armazenar o erro de cada época
    const progressData: TrainingProgress[] = [];
    for (let epoch = 0; epoch < nnConfig.epochs; epoch++) {
      // Treina a rede para uma época e retorna o erro
      const error = trainMLP(newMlp, NN_DATASET, nnConfig.learningRate);
      progressData.push({ epoch: epoch + 1, error });
      // Atualiza a interface periodicamente para mostrar o progresso
      if ((epoch + 1) % Math.max(1, Math.floor(nnConfig.epochs / 100)) === 0) {
        setStatusMessage(`Treinando Época: ${epoch + 1}/${nnConfig.epochs}, Erro: ${error.toFixed(6)}`);
        setTrainingProgress([...progressData]);
        await new Promise(resolve => setTimeout(resolve, 0)); // Permite atualização da interface
      }
    }
    setTrainingProgress(progressData); // Atualiza o progresso final
    setIsTraining(false); // Treinamento finalizado
    setStatusMessage(`Treinamento completo. Erro final: ${progressData[progressData.length-1]?.error.toFixed(6) || 'N/D'}`);
    
    // Após o treinamento, faz previsões para cada entrada do dataset
    const preds: string[] = [];
    NN_DATASET.forEach(data => {
        const output = newMlp.predict(data.input);
        // Converte a saída para binário (0 ou 1)
        const binaryOutput = output.map(o => (o > 0.9 ? 1 : 0)).join('');
        preds.push(`Entrada: ${data.decimal} -> Previsto: ${binaryOutput} (Bruto: ${output.map(o => o.toFixed(3)).join(', ')})`);
    });
    setPredictions(preds); // Atualiza as previsões

  }, [nnConfig]);

  // Renderização da interface
  return (
    <div className="space-y-8">
      {/* Card de configuração da rede neural */}
      <Card title="Configuração da Rede Neural (MLP)">
        <p className="mb-4 text-gray-300">
          Esta ferramenta demonstra um Perceptron Multicamadas (MLP) para classificar dígitos de 0 a 7.
          A entrada é um decimal normalizado, e a saída é uma representação binária de 3 bits.
        </p>
        {/* Formulário para configurar a rede neural */}
        <NNConfigForm config={nnConfig} onConfigChange={handleConfigChange} />
        {/* Botão para iniciar o treinamento */}
        <NNTrainControls onTrain={handleTrain} isTraining={isTraining} />
         {/* Mensagem de status do treinamento */}
         <p className="text-sm text-gray-400 mt-4">{statusMessage}</p>
      </Card>
      
      {/* Exibe os resultados do treinamento e previsões após o treinamento */}
      {(trainingProgress.length > 0 || predictions.length > 0) && (
        <Card title="Resultados do Treinamento e Previsões">
          <NNVisualization trainingProgress={trainingProgress} predictions={predictions} />
        </Card>
      )}
    </div>
  );
};
