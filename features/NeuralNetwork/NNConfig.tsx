import React from 'react';
import type { NNConfig } from '../../types';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

// Propriedades esperadas pelo formulário de configuração da rede neural
interface NNConfigFormProps {
  config: NNConfig; // Configuração atual da rede
  onConfigChange: (newConfig: Partial<NNConfig>) => void; // Função para atualizar config
}

// Formulário para configurar os parâmetros da rede neural
export const NNConfigForm: React.FC<NNConfigFormProps> = ({ config, onConfigChange }) => {
  // Função para lidar com mudanças nos campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Atualiza o número de neurônios da camada oculta
    if (name.startsWith('hiddenLayerNeurons')) {
      const layerIndex = parseInt(name.split('-')[1], 10);
      const newHiddenLayers = [...config.hiddenLayers];
      newHiddenLayers[layerIndex] = { ...newHiddenLayers[layerIndex], neurons: parseInt(value, 10) };
      onConfigChange({ hiddenLayers: newHiddenLayers });
    // Atualiza a função de ativação da camada oculta
    } else if (name.startsWith('hiddenLayerActivation')) {
      const layerIndex = parseInt(name.split('-')[1], 10);
      const newHiddenLayers = [...config.hiddenLayers];
      newHiddenLayers[layerIndex] = { ...newHiddenLayers[layerIndex], activation: value as any };
      onConfigChange({ hiddenLayers: newHiddenLayers });
    } else {
      // Atualiza taxa de aprendizado ou épocas
      onConfigChange({ [name]: name === 'epochs' || name === 'learningRate' ? parseFloat(value) : value });
    }
  };

  // Por simplicidade, só permite configurar uma camada oculta
  const hiddenLayer = config.hiddenLayers[0] || { neurons: 5, activation: 'sigmoid' };

  return (
    <div className="space-y-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo para taxa de aprendizagem */}
        <Input
          label="Taxa de Aprendizagem"
          type="number"
          name="learningRate"
          value={config.learningRate}
          onChange={handleInputChange}
          step="0.01"
          min="0.001"
        />
        {/* Campo para número de épocas */}
        <Input
          label="Épocas"
          type="number"
          name="epochs"
          value={config.epochs}
          onChange={handleInputChange}
          step="100"
          min="100"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-200 pt-2">Camada Oculta 1</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Campo para número de neurônios da camada oculta */}
        <Input
          label="Número de Neurônios"
          type="number"
          name="hiddenLayerNeurons-0"
          value={hiddenLayer.neurons}
          onChange={handleInputChange}
          min="1"
        />
        {/* Campo para função de ativação da camada oculta */}
        <Select
          label="Função de Ativação"
          name="hiddenLayerActivation-0"
          value={hiddenLayer.activation}
          onChange={handleInputChange}
          options={[
            { value: 'sigmoid', label: 'Sigmoide' },
            { value: 'relu', label: 'ReLU' },
            { value: 'tanh_approx', label: 'Tanh (aprox.)' },
            { value: 'linear', label: 'Linear' },
          ]}
        />
      </div>
    </div>
  );
};
