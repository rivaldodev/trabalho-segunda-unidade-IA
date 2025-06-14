import React from 'react';
import { Button } from '../../components/ui/Button';

// Propriedades esperadas pelo componente de controle de treinamento
interface NNTrainControlsProps {
  onTrain: () => void;      // Função chamada ao iniciar o treinamento
  isTraining: boolean;      // Indica se está treinando
}

// Botão para iniciar o treinamento da rede neural
export const NNTrainControls: React.FC<NNTrainControlsProps> = ({ onTrain, isTraining }) => {
  return (
    <div>
      {/* Botão que inicia o treinamento e mostra loading se estiver treinando */}
      <Button onClick={onTrain} isLoading={isTraining} disabled={isTraining} className="w-full md:w-auto">
        {isTraining ? 'Treinando Rede...' : 'Iniciar Treinamento MLP'}
      </Button>
    </div>
  );
};
