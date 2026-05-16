# Gerador de Orçamentos - Frontend

Um frontend web moderno e vibrante para profissionais prestadores de serviços (construção, encanamento, elétrica, reparo automotivo, etc.) criarem, gerenciarem e acompanharem orçamentos e projetos profissionais de forma rápida.

## 🚀 Tecnologias

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes de UI:** [Shadcn UI](https://ui.shadcn.com/)
- **Gerenciamento de Estado:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Ícones:** [Lucide React](https://lucide.dev/)

## 🛠️ Funcionalidades

- **Dashboard Moderno:** Painel administrativo intuitivo para gerenciar todos os orçamentos do negócio.
- **Gerenciamento de Orçamentos:** Criação, edição e acompanhamento do ciclo de vida dos orçamentos.
- **Apresentação Profissional:** Focado em construir confiança com o cliente através de uma interface de alta qualidade.

## 🏁 Primeiros Passos

Primeiro, instale as dependências:

```bash
npm install
```

Depois, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

## 📁 Estrutura do Projeto

- `src/app`: Páginas e layouts do Next.js App Router.
- `src/components`: Componentes de UI reutilizáveis (Shadcn UI).
- `src/store`: Gerenciamento de estado global usando Zustand.
- `conductor/`: Orquestração e documentação do projeto (desenvolvido com Gemini CLI Conductor).

## 🤖 Desenvolvido com Gemini CLI

Este projeto utiliza a extensão **Conductor** do [Gemini CLI](https://github.com/google/gemini-cli) para orquestração arquitetural e acompanhamento de tarefas. Veja o [conductor/README.md](./conductor/README.md) para mais detalhes.
