
import React from 'react';
import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { generateText } from './services/geminiService';
import type { GeminiMessage } from '../../types';
import { PaperAirplaneIcon, UserCircleIcon, SparklesIcon } from '@heroicons/react/24/solid'; // Using heroicons for icons


const ChatBubble: React.FC<{ message: GeminiMessage }> = ({ message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex items-end max-w-xs md:max-w-md lg:max-w-lg ${isUser ? 'flex-row-reverse' : ''}`}>
        {isUser ? (
          <UserCircleIcon className="h-8 w-8 text-blue-400 ml-2" />
        ) : (
          <SparklesIcon className="h-8 w-8 text-accent mr-2" />
        )}
        <div
          className={`px-4 py-3 rounded-xl ${
            isUser ? 'bg-primary text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
           <p className="text-xs mt-1 opacity-60 text-right">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};


export const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<GeminiMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: GeminiMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Construct a simple history for context if needed, or just send the current input
      // For a more conversational experience, you'd send relevant parts of `messages`
      const modelResponseText = await generateText(userMessage.text);
      const modelMessage: GeminiMessage = { role: 'model', text: modelResponseText, timestamp: Date.now() };
      setMessages(prev => [...prev, modelMessage]);
    } catch (e: any) {
      const errorMessageText = e.message || 'Não foi possível obter resposta do Assistente de IA.';
      setError(errorMessageText);
      const errorMessage: GeminiMessage = { role: 'model', text: `Erro: ${errorMessageText}`, timestamp: Date.now() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input]);

  return (
    <Card title="Assistente de IA" className="flex flex-col h-[calc(100vh-12rem)]">
      <p className="text-sm text-gray-400 mb-4">
        Faça perguntas sobre conceitos de IA, Algoritmos Genéticos, Redes Neurais ou esta aplicação.
        Potencializado por Google Gemini.
      </p>
      <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 bg-gray-800 rounded-md mb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        {messages.length === 0 && !isLoading && (
          <p className="text-center text-gray-500">Nenhuma mensagem ainda. Comece a conversa!</p>
        )}
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg} />
        ))}
        {isLoading && messages.length > 0 && messages[messages.length -1].role === 'user' && (
            <div className="flex justify-start mb-4">
                 <SparklesIcon className="h-8 w-8 text-accent mr-2" />
                <div className="px-4 py-3 rounded-lg bg-gray-700 text-gray-200">
                    <LoadingSpinner size="sm" message="Pensando..." />
                </div>
            </div>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <div className="flex items-center border-t border-gray-700 pt-4">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
          className="flex-grow mr-2"
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} isLoading={isLoading} disabled={isLoading || !input.trim()} className="bg-accent hover:bg-amber-400">
          <PaperAirplaneIcon className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
};
