# Plano de Implementação: Exclusão de Orçamentos

Este plano descreve as mudanças necessárias para adicionar a funcionalidade de excluir orçamentos tanto na página de histórico quanto na visualização de atividades recentes no dashboard.

## Objetivo
Permitir que os usuários removam orçamentos indesejados do sistema, seguindo o padrão de confirmação já estabelecido no projeto.

## Arquivos Chave e Contexto
- `src/app/quotes/page.tsx`: Lista principal de orçamentos.
- `src/app/page.tsx`: Dashboard com "Atividade Recente".
- `src/hooks/useQuotes.ts`: Fornece o hook `useDeleteQuote`.

## Etapas de Implementação

### 1. Atualizar a Página de Histórico de Orçamentos (`src/app/quotes/page.tsx`)
- Importar o hook `useDeleteQuote`.
- Adicionar uma função `handleDelete` que usa `window.confirm`.
- **Desktop:** Adicionar um botão de exclusão (ícone `Trash2`) na coluna de ações da tabela.
- **Mobile:** Adicionar um botão de exclusão nos cards de orçamento.

### 2. Atualizar o Dashboard (`src/app/page.tsx`)
- Importar o hook `useDeleteQuote`.
- Adicionar a lógica de exclusão com confirmação.
- Adicionar um botão de exclusão (ícone `Trash2`) em cada item da lista de "Atividade Recente".

## Verificação e Testes

### Testes Manuais
1. Navegar para a página de orçamentos.
2. Tentar excluir um orçamento. Cancelar a confirmação e verificar se nada mudou.
3. Tentar excluir um orçamento e confirmar. Verificar se o item desaparece da lista.
4. Repetir o processo no dashboard (Atividade Recente).
5. Verificar se as estatísticas no dashboard são atualizadas após a exclusão.

### Testes Automatizados
- Se houver testes para a página de orçamentos, atualizar para verificar a presença e funcionalidade do botão de exclusão.
