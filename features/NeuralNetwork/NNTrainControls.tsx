
import React from 'react';
import { Button } from '../../components/ui/Button';

interface NNTrainControlsProps {
  onTrain: () => void;
  isTraining: boolean;
}

export const NNTrainControls: React.FC<NNTrainControlsProps> = ({ onTrain, isTraining }) => {
  return (
    <div>
      <Button onClick={onTrain} isLoading={isTraining} disabled={isTraining} className="w-full md:w-auto">
        {isTraining ? 'Treinando Rede...' : 'Iniciar Treinamento MLP'}
      </Button>
    </div>
  );
};
