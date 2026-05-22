# Plano de Implementação: Alteração de Status de Orçamentos

Este plano descreve as mudanças necessárias para permitir que o usuário altere o status de um orçamento diretamente na lista de orçamentos.

## Objetivo
Adicionar interatividade ao status dos orçamentos na página de histórico, permitindo atualizações rápidas sem sair da lista.

## Arquivos Chave e Contexto
- `src/app/quotes/page.tsx`: Componente principal da lista de orçamentos onde a mudança será visível.
- `src/hooks/useQuotes.ts`: Contém o hook `useUpdateQuote` que será utilizado para realizar a alteração.
- `src/lib/api.ts`: Define os tipos de `QuoteStatus` e utilitários de labels/buckets.

## Etapas de Implementação

### 1. Criar Componente StatusSelect
Vou criar um componente interno em `src/app/quotes/page.tsx` (ou extrair se ficar muito grande) chamado `StatusSelect`.
- Ele receberá o status atual e o ID do orçamento.
- Usará o hook `useUpdateQuote`.
- Terá estilos dinâmicos baseados no bucket do status (semelhante ao `StatusBadge` atual).

### 2. Atualizar QuotesHistory
- Importar `useUpdateQuote` no componente `QuotesHistory`.
- Substituir as instâncias de `StatusBadge` pelo novo `StatusSelect` tanto na visualização Desktop quanto na Mobile.

### 3. Melhorar a Experiência do Usuário (Opcional/Refinamento)
- Adicionar um estado de "loading" ou desativar o seletor enquanto a mutação está em progresso para evitar cliques duplos.

## Verificação e Testes

### Testes Manuais
1. Abrir a página de orçamentos.
2. Alterar o status de um orçamento "Rascunho" para "Aprovado".
3. Verificar se a cor do badge/select muda instantaneamente.
4. Recarregar a página para garantir que a mudança foi persistida no backend (através do mock/api).
5. Verificar se os filtros de status na parte superior da página continuam funcionando corretamente com as mudanças.

### Testes Automatizados
- Atualizar `src/app/quotes/page.test.tsx` (se existir e for relevante) para verificar se o seletor de status está presente e se chama a função de atualização ao ser alterado.
