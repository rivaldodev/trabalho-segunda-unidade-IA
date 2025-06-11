
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { GAIndividual, GAIterationResult } from '../../types';
import { Card } from '../../components/ui/Card';

interface GAResultsProps {
  results: GAIterationResult[];
  bestIndividual: GAIndividual | null;
}

export const GAResults: React.FC<GAResultsProps> = ({ results, bestIndividual }) => {
  if (results.length === 0 && !bestIndividual) {
    return <p className="text-gray-400">O algoritmo ainda não foi executado ou não há resultados para exibir.</p>;
  }

  return (
    <div className="space-y-6">
      {bestIndividual && (
        <Card title="Melhor Solução Encontrada" className="bg-gray-800">
          <p><strong>Aptidão (f(x,y)):</strong> <span className="text-green-400 font-bold">{bestIndividual.fitness.toFixed(6)}</span></p>
          <p><strong>x:</strong> {bestIndividual.x.toFixed(4)}</p>
          <p><strong>y:</strong> {bestIndividual.y.toFixed(4)}</p>
          <p><strong>Cromossomo:</strong> <span className="text-xs break-all">{bestIndividual.chromosome}</span></p>
        </Card>
      )}

      {results.length > 0 && (
        <Card title="Aptidão ao Longo das Gerações" className="bg-gray-800">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={results}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
              <XAxis dataKey="generation" stroke="#A0AEC0" label={{ value: 'Geração', position: 'insideBottomRight', offset: -5, fill: '#A0AEC0' }} />
              <YAxis stroke="#A0AEC0" label={{ value: 'Aptidão', angle: -90, position: 'insideLeft', fill: '#A0AEC0' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4A5568', color: '#E5E7EB' }}
                itemStyle={{ color: '#E5E7EB' }}
              />
              <Legend wrapperStyle={{ color: '#E5E7EB' }}/>
              <Line type="monotone" dataKey="bestFitness" stroke="#38B2AC" strokeWidth={2} name="Melhor Aptidão" dot={false} />
              <Line type="monotone" dataKey="averageFitness" stroke="#F59E0B" strokeWidth={2} name="Aptidão Média" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
};
