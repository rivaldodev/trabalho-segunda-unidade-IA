
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { TrainingProgress } from '../../types';
import { Card } from '../../components/ui/Card';

interface NNVisualizationProps {
  trainingProgress: TrainingProgress[];
  predictions: string[];
}

export const NNVisualization: React.FC<NNVisualizationProps> = ({ trainingProgress, predictions }) => {
  return (
    <div className="space-y-6">
      {trainingProgress.length > 0 && (
        <Card title="Erro de Treinamento ao Longo das Épocas" className="bg-gray-800">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trainingProgress}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568"/>
              <XAxis dataKey="epoch" stroke="#A0AEC0" label={{ value: 'Época', position: 'insideBottomRight', offset: -5, fill: '#A0AEC0' }} />
              <YAxis stroke="#A0AEC0" label={{ value: 'Erro', angle: -90, position: 'insideLeft', fill: '#A0AEC0' }} />
              <Tooltip  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4A5568', color: '#E5E7EB' }} />
              <Legend wrapperStyle={{ color: '#E5E7EB' }} />
              <Line type="monotone" dataKey="error" stroke="#DB2777" strokeWidth={2} dot={false} name="Erro" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
      {predictions.length > 0 && (
        <Card title="Previsões no Conjunto de Dados" className="bg-gray-800">
          <ul className="space-y-1 text-sm text-gray-300 max-h-60 overflow-y-auto">
            {predictions.map((pred, index) => (
              <li key={index} className="font-mono p-1 bg-gray-700 rounded-sm">{pred}</li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};
