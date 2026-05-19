# Implementation Plan: Clients Feature

## Phase 1: Data Layer & State Management [checkpoint: 87f5888]
- [x] Task: Update Client Store and Types 58ab483
    - [ ] Update `src/store/useClientStore.ts` interface to match the new schema (`name`, `email`, `phone`, `address`, `addressName`).
    - [ ] Update mock data to reflect the new structure.
- [x] Task: Create Client API Hooks 9697bfd
    - [ ] Write failing test for `useCreateClient` and `useGetClients` hooks (mocking API call).
    - [ ] Implement hooks in `src/hooks/useClients.ts` using React Query to handle state and submissions.
- [x] Task: Conductor - User Manual Verification 'Data Layer & State Management' (Protocol in workflow.md)

## Phase 2: Client Creation UI (Slide-out Panel)
- [ ] Task: Create Client Form Component
    - [ ] Write failing test for `ClientForm` component rendering and Zod validation.
    - [ ] Implement `ClientForm.tsx` using `react-hook-form` and Shadcn UI inputs.
- [ ] Task: Create Slide-out Panel Component
    - [ ] Write failing test to ensure the panel opens/closes and triggers form submission correctly.
    - [ ] Implement `CreateClientSheet.tsx` using Shadcn UI `Sheet`, wrapping the `ClientForm`.
- [ ] Task: Conductor - User Manual Verification 'Client Creation UI' (Protocol in workflow.md)

## Phase 3: Clients List Page
- [ ] Task: Create Clients Table Component
    - [ ] Write failing test for `ClientsTable` to verify it renders correct columns and mock data rows.
    - [ ] Implement `ClientsTable.tsx` using Shadcn UI `Table`.
- [ ] Task: Implement Main Clients Route
    - [ ] Write failing test for `/clients` page.
    - [ ] Create `src/app/clients/page.tsx` integrating the Table and the Sheet trigger.
- [ ] Task: Add Navigation Link
    - [ ] Update `src/components/layout/Shell.tsx` to include a navigation link to `/clients`.
- [ ] Task: Conductor - User Manual Verification 'Clients List Page' (Protocol in workflow.md)