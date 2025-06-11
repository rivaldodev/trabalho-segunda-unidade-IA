
import React from 'react';
import type { GAParams } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

interface GAParamsFormProps {
  params: GAParams;
  onParamsChange: (newParams: Partial<GAParams>) => void;
  onStart: () => void;
  isRunning: boolean;
}

export const GAParamsForm: React.FC<GAParamsFormProps> = ({ params, onParamsChange, onStart, isRunning }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onParamsChange({ [e.target.name]: Number(e.target.value) });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onStart(); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Tamanho da População"
          type="number"
          name="populationSize"
          value={params.populationSize}
          onChange={handleChange}
          min="10"
          step="10"
          disabled={isRunning}
        />
        <Input
          label="Gerações"
          type="number"
          name="generations"
          value={params.generations}
          onChange={handleChange}
          min="10"
          step="10"
          disabled={isRunning}
        />
        <Input
          label="Taxa de Mutação (0.0 - 1.0)"
          type="number"
          name="mutationRate"
          value={params.mutationRate}
          onChange={handleChange}
          min="0"
          max="1"
          step="0.01"
          disabled={isRunning}
        />
        <Input
          label="Taxa de Crossover (0.0 - 1.0)"
          type="number"
          name="crossoverRate"
          value={params.crossoverRate}
          onChange={handleChange}
          min="0"
          max="1"
          step="0.01"
          disabled={isRunning}
        />
      </div>
      <Button type="submit" isLoading={isRunning} disabled={isRunning} className="w-full md:w-auto">
        {isRunning ? 'Executando...' : 'Iniciar Algoritmo Genético'}
      </Button>
    </form>
  );
};
