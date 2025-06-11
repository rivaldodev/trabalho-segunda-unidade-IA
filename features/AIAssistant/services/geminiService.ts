
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GEMINI_MODEL_NAME, GEMINI_API_KEY_PLACEHOLDER } from '../../../constants';


const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY || GEMINI_API_KEY_PLACEHOLDER;

if (API_KEY === GEMINI_API_KEY_PLACEHOLDER && process.env.NODE_ENV !== 'test') {
  console.warn(
    "A chave da API Gemini é um placeholder. Substitua pela sua chave real ou defina process.env.REACT_APP_GEMINI_API_KEY."
  );
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateText(prompt: string): Promise<string> {

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{ parts: [{ text: prompt }] }],
      // Optional: Add thinkingConfig based on guidelines if needed for specific tasks
      // config: { thinkingConfig: { thinkingBudget: 0 } } // Example: disable thinking for low latency
    });
    
    // The text is directly available on the response object
    return response.text;

  } catch (error: any) {
    console.error("Erro ao chamar a API Gemini:", error);
    const errorMessageString = error?.message ? String(error.message) : String(error);
    
    if (errorMessageString.includes('API key not valid')) {
        return "Erro: Chave de API inválida. Por favor, verifique sua configuração.";
    }
    return `Erro ao gerar texto: ${errorMessageString || 'Erro desconhecido'}`;
  }
}

// Example for generating text with JSON response (if needed)
// Not used in current AIAssistantPage, but shown for completeness
export async function generateJson(prompt: string): Promise<object | string> {
   if (API_KEY === GEMINI_API_KEY_PLACEHOLDER) {
    return Promise.resolve({ error: "Assistente de IA não configurado. Por favor, defina a chave da API." });
  }
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: [{parts: [{text: prompt}]}],
      config: {
        responseMimeType: "application/json",
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    try {
      return JSON.parse(jsonStr);
    } catch (e: any) {
      console.error("Falha ao processar resposta JSON da Gemini:", e, "Texto bruto:", jsonStr);
      const exceptionMessage = e?.message ? String(e.message) : String(e);
      return `Erro ao processar JSON: ${exceptionMessage || 'Erro desconhecido'}. Bruto: ${jsonStr.substring(0,100)}...`;
    }
  } catch (error: any) {
    console.error("Erro ao chamar API Gemini para JSON:", error);
    const errorMessageString = error?.message ? String(error.message) : String(error);

     if (errorMessageString.includes('API key not valid')) {
        return { error: "Chave de API Inválida. Por favor, verifique sua configuração."};
    }
    return `Erro ao gerar JSON: ${errorMessageString || 'Erro desconhecido'}`;
  }
}
