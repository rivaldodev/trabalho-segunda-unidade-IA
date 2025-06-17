import React from 'react';
import type { GAParams } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

// Propriedades esperadas pelo formulário de parâmetros do AG
interface GAParamsFormProps {
  params: GAParams;                                    // Parâmetros atuais do algoritmo
  onParamsChange: (newParams: Partial<GAParams>) => void; // Função para atualizar parâmetros
  onStart: () => void;                                 // Função para iniciar o algoritmo
  isRunning: boolean;                                  // Indica se o algoritmo está executando
}

// Formulário para configurar os parâmetros do Algoritmo Genético
export const GAParamsForm: React.FC<GAParamsFormProps> = ({ params, onParamsChange, onStart, isRunning }) => {
  // Função para lidar com mudanças nos campos do formulário
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onParamsChange({ [e.target.name]: Number(e.target.value) });
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onStart(); }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campo para tamanho da população */}
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
        {/* Campo para número de gerações */}
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
        {/* Campo para taxa de mutação */}
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
        {/* Campo para taxa de crossover */}
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
      {/* Botão para iniciar o algoritmo genético */}
      <Button type="submit" isLoading={isRunning} disabled={isRunning} className="w-full md:w-auto">
        {isRunning ? 'Executando...' : 'Iniciar Algoritmo Genético'}
      </Button>
    </form>
  );
};
