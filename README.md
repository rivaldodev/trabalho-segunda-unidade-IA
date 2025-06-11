# Playground de Algoritmos de IA

## Visão Geral

Uma aplicação web interativa desenvolvida como parte do **Trabalho da Segunda Unidade** da disciplina de **Inteligência Artificial**, ministrada pelo Professor Danniel Cavalcante Lopes no período de 2025.1. Este playground permite aos usuários explorar, configurar e visualizar o funcionamento de dois algoritmos fundamentais da IA: Algoritmos Genéticos e Redes Neurais (Perceptron Multicamadas com Backpropagation). Adicionalmente, a aplicação conta com um Assistente de IA para responder a dúvidas e fornecer informações sobre os temas abordados.

Os algoritmos foram implementados do zero, seguindo as especificações e restrições propostas nos trabalhos da disciplina.

## Funcionalidades

A aplicação é dividida em três módulos principais:

### 1. Algoritmo Genético

Este módulo implementa um Algoritmo Genético (AG) com o objetivo de encontrar o valor máximo da função `f(x,y) = |e^(-x) - y^2 + 1| + 10^-4`). Esta demonstração prática reflete os conceitos abordados em trabalhos acadêmicos de Algoritmos Genéticos, explorando:

*   **Representação:** Indivíduos são representados por cromossomos binários. Cada variável (x e y) é codificada com um número específico de bits para cobrir o intervalo de busca (ex: `[-10, 10]`) com uma precisão definida (ex: `0.005`).
*   **População Inicial:** Uma população de indivíduos (cromossomos) é gerada aleatoriamente.
*   **Função de Aptidão (Fitness):** A própria função objetivo `f(x,y)` é utilizada para avaliar a aptidão de cada indivíduo. O objetivo é maximizar essa função.
*   **Operadores Genéticos:**
    *   **Seleção:** Implementa o método da Roleta, onde indivíduos com maior aptidão têm maior probabilidade de serem selecionados como pais para a próxima geração.
    *   **Crossover (Recombinação):** Utiliza o crossover de ponto único (ou outro método especificado) para recombinar o material genético dos pais selecionados, gerando novos descendentes.
    *   **Mutação:** Aplica a mutação do tipo bit-flip, alterando aleatoriamente bits nos cromossomos dos descendentes para introduzir e manter a diversidade genética na população.
*   **Configuração:** O usuário pode configurar parâmetros chave do AG:
    *   Tamanho da População
    *   Número de Gerações
    *   Taxa de Mutação
    *   Taxa de Crossover
*   **Visualização:** Um gráfico exibe a evolução da melhor aptidão e da aptidão média da população ao longo das gerações. O melhor indivíduo encontrado (valores de x, y, aptidão e seu cromossomo) também é exibido ao final da execução.

### 2. Rede Neural (MLP com Backpropagation)

Este módulo demonstra um Perceptron Multicamadas (MLP) treinado com o algoritmo de backpropagation. O objetivo é resolver um problema de classificação, como o da classificação de dígitos de 0 a 7. A entrada é um valor normalizado e a saída é uma representação binária.

*   **Arquitetura da Rede:**
    *   Camada de entrada: Número de neurônios correspondente às características da entrada (ex: 1 neurônio para o dígito normalizado).
    *   Camadas Ocultas: O usuário pode configurar o número de camadas ocultas, o número de neurônios em cada uma e suas respectivas funções de ativação (ex: Sigmoide, ReLU, Tanh, Linear). É crucial usar funções não-lineares nas camadas ocultas para problemas complexos.
    *   Camada de Saída: Número de neurônios correspondente ao formato da saída desejada (ex: 3 neurônios para representação binária de 3 bits), geralmente com função de ativação Sigmoide para problemas de classificação.
*   **Treinamento com Backpropagation:**
    *   O algoritmo de backpropagation é implementado para ajustar os pesos e biases da rede, minimizando o erro entre a saída predita e a saída desejada (alvo).
    *   O usuário pode configurar a taxa de aprendizado e o número de épocas de treinamento.
*   **Conjunto de Dados:** Utiliza um conjunto de dados fixo para a classificação dos dígitos de 0 a 7 (ou outro conforme especificado), onde a entrada é o dígito normalizado e a saída é sua representação binária.
*   **Restrições de Implementação:** O trabalho requer que não sejam utilizadas bibliotecas de machine learning prontas (ex: Weka, Tensorflow, scikit-learn) para a implementação do MLP e do backpropagation.
*   **Visualização:**
    *   Um gráfico exibe a evolução do erro de treinamento (ex: erro quadrático médio) ao longo das épocas.
    *   As previsões da rede para cada entrada do conjunto de dados são exibidas, comparando a saída predita com a saída esperada.

### 3. Assistente de IA

Um chatbot interativo que utiliza a API Google Gemini (`gemini-2.5-flash-preview-04-17`) para responder a perguntas dos usuários. Este assistente pode fornecer informações sobre:
*   Conceitos de Inteligência Artificial abordados nas aulas da disciplina.
*   Detalhes sobre os Algoritmos Genéticos (Seleção por Torneio, Dizimação, Operadores de Crossover, Mutação Dirigida, Elitismo, Steady State, etc.).
*   Funcionamento das Redes Neurais (Perceptron, Adaline, MLP, Backpropagation, Funções de Ativação, Self-Organized Maps, etc.).
*   Aspectos específicos da implementação nesta aplicação.

## Estrutura do Projeto

O projeto segue uma estrutura modular para facilitar a organização e o desenvolvimento:

*   `index.html`: Ponto de entrada principal da aplicação web. Contém a configuração do `importmap` para as dependências.
*   `index.tsx`: Script raiz que renderiza a aplicação React no `index.html`.
*   `App.tsx`: Componente principal da aplicação, responsável pelo roteamento entre as diferentes páginas/funcionalidades.
*   `src/components/`:
    *   `layout/`: Componentes de layout reutilizáveis (ex: `Navbar.tsx`, `PageLayout.tsx`).
    *   `ui/`: Componentes de UI genéricos (ex: `Button.tsx`, `Input.tsx`, `Card.tsx`, `LoadingSpinner.tsx`).
*   `src/features/`: Contém a lógica e os componentes específicos para cada funcionalidade principal.
    *   `GeneticAlgorithm/`: Componentes (`GeneticAlgorithmPage.tsx`, `GAParameters.tsx`, `GAResults.tsx`) e serviços (`ga.ts`) para o AG.
    *   `NeuralNetwork/`: Componentes (`NeuralNetworkPage.tsx`, `NNConfig.tsx`, `NNTrainControls.tsx`, `NNVisualization.tsx`) e serviços (`mlp.ts`) para a Rede Neural.
    *   `AIAssistant/`: Componentes (`AIAssistantPage.tsx`) e serviços (`geminiService.ts`) para o Assistente de IA.
*   `src/constants.ts`: Constantes globais utilizadas na aplicação (ex: parâmetros padrão de algoritmos, nomes de modelos).
*   `src/types.ts`: Definições de tipos e interfaces TypeScript globais.
*   `metadata.json`: Metadados da aplicação, como nome e descrição.
*   `tailwind.config.js`: Arquivo de configuração para o Tailwind CSS.

## Como Rodar Localmente

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local:

1.  **Pré-requisitos:**
    *   Um navegador web moderno (Chrome, Firefox, Edge, etc.).
    *   Um servidor web local simples para servir os arquivos estáticos. Se você tiver o Node.js instalado, pode usar `npx serve`. Alternativamente, se usar o VS Code, a extensão "Live Server" é uma ótima opção.

2.  **Clonar o Repositório (se aplicável):**
    ```bash
    git clone https://github.com/rivaldodev/trabalho-segunda-unidade-IA.git
    cd trabalho-segunda-unidade-IA
    ```


3.  **Configuração da Chave da API Gemini (Obrigatório para o Assistente de IA):**
    *   Para que o módulo "Assistente de IA" funcione, você precisará de uma chave da API do Google Gemini.
    *   Obtenha sua chave em [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   **Como esta aplicação é um projeto frontend puro servido estaticamente e não possui um processo de build que injeta variáveis de ambiente (como `Create React App` faria com `REACT_APP_...`), você precisará editar diretamente o arquivo:**
        `src/features/AIAssistant/services/geminiService.ts`
    *   Localize a seguinte linha (ou similar) no início do arquivo:
        ```typescript
        const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || process.env.GEMINI_API_KEY || GEMINI_API_KEY_PLACEHOLDER;
        ```
    *   **Substitua esta linha pela sua chave da API**. Por exemplo:
        ```typescript
        const API_KEY = "SUA_CHAVE_API_AQUI";
        ```
        (Substitua `"SUA_CHAVE_API_AQUI"` pela sua chave real).
    *   **Atenção:** Lembre-se de que não é seguro expor chaves de API diretamente no código do lado do cliente em aplicações de produção. Para este projeto acadêmico, essa é a forma direta de configuração. Em um cenário real, um backend proxy seria o ideal para proteger a chave.

4.  **Iniciar a Aplicação:**
    *   **Usando `npm` (requer Node.js):**
        1.  Abra seu terminal ou prompt de comando.
        2.  Navegue até a pasta raiz do projeto (a pasta que contém `index.html`).
        3.  Execute o comando:
            ```bash
            npm install
            npm run dev
            ```
        4.  O terminal mostrará um endereço local (geralmente `http://localhost:3000` ou similar).
    *   Abra o seu navegador web e acesse o endereço fornecido pelo servidor local.

## Tecnologias Utilizadas

*   **Frontend:**
    *   React 19 (via esm.sh)
    *   TypeScript
    *   React Router DOM (v7, via esm.sh)
    *   Tailwind CSS (via CDN)
    *   Recharts (para gráficos, via esm.sh)
    *   Heroicons (para ícones, via esm.sh)
*   **Backend (para o Assistente de IA):**
    *   Google Gemini API (`@google/genai` via esm.sh) - A API é consumida diretamente pelo frontend.

## Informações da Disciplina

*   **Trabalho:** Segunda Unidade
*   **Disciplina:** Inteligência Artificial
*   **Professor:** Danniel Cavalcante Lopes
*   **Período:** 2025.1

## Autores

*   Rivaldo Freitas de Carvalho
*   Paulo Victor Alves da Silva
