// Constantes do Algoritmo Genético
export const GA_FUNCTION_TEXT = "f(x,y) = abs(exp(-x) - y^2 + 1) + 0.0001"; // Função de avaliação
export const GA_VARIABLE_PRECISION = 0.005; // Precisão das variáveis
export const GA_VARIABLE_MIN = -10;         // Valor mínimo das variáveis
export const GA_VARIABLE_MAX = 10;          // Valor máximo das variáveis
export const GA_BITS_PER_VARIABLE = 12;     // Bits necessários para representar cada variável
export const GA_CHROMOSOME_LENGTH = GA_BITS_PER_VARIABLE * 2; // Tamanho total do cromossomo (x e y)

// Constantes da Rede Neural
// Dataset para classificação de dígitos de 0 a 7
// Entrada: decimal normalizado, Saída: binário de 3 bits
export const NN_DATASET = [
  { input: [0.0 / 7.0], output: [0, 0, 0], decimal: 0 }, // 0
  { input: [1.0 / 7.0], output: [0, 0, 1], decimal: 1 }, // 1
  { input: [2.0 / 7.0], output: [0, 1, 0], decimal: 2 }, // 2
  { input: [3.0 / 7.0], output: [0, 1, 1], decimal: 3 }, // 3
  { input: [4.0 / 7.0], output: [1, 0, 0], decimal: 4 }, // 4
  { input: [5.0 / 7.0], output: [1, 0, 1], decimal: 5 }, // 5
  { input: [6.0 / 7.0], output: [1, 1, 0], decimal: 6 }, // 6
  { input: [7.0 / 7.0], output: [1, 1, 1], decimal: 7 }, // 7
];
export const NN_INPUT_NEURONS = 1;   // Número de neurônios de entrada
export const NN_OUTPUT_NEURONS = 3;  // Número de neurônios de saída

// Constantes da API Gemini
export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17'; // Nome do modelo Gemini
// A chave da API Gemini deve ser lida do arquivo .env via process.env
export const GEMINI_API_KEY_PLACEHOLDER = process.env.GEMINI_API_KEY || "";
