# Orquestração Conductor

Este diretório contém a lógica estrutural e procedural para o desenvolvimento do projeto, orquestrada pela **extensão Conductor do Gemini CLI**.

## 🧠 O que é o Conductor?

O Conductor é um framework para gerenciar tarefas complexas de desenvolvimento de software usando agentes de IA. Ele organiza o projeto em:

-   **Visão do Produto:** Definindo o "O quê" e o "Porquê" (`product.md`).
-   **Tech Stack:** Selecionando as ferramentas (`tech-stack.md`).
-   **Tracks (Trilhas):** Marcos sequenciais ou paralelos para implementação (`tracks/`).
-   **Diretrizes:** Aplicando padrões consistentes de código e de produto (`product-guidelines.md`, `code_styleguides/`).

## 🤖 Desenvolvido com Gemini CLI

Este projeto foi desenvolvido através da extensão **Conductor** do [Gemini CLI](https://github.com/google/gemini-cli).

Os agentes usam os arquivos neste diretório como sua "fonte da verdade" para:
1.  **Arquitetura:** Seguindo a stack tecnológica definida.
2.  **Estado:** Acompanhando o progresso através das "Tracks".
3.  **Contexto:** Entendendo os requisitos do produto sem a necessidade de explicações manuais.

## 📁 Estrutura do Diretório

-   `product.md`: Visão de alto nível e funcionalidades.
-   `tech-stack.md`: Documentação das tecnologias escolhidas.
-   `tracks/`: Contém planos de implementação específicos e metadados para cada marco.
-   `code_styleguides/`: Padrões técnicos para TypeScript, CSS e codificação geral.
