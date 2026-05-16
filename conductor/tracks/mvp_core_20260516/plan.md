# Implementation Plan - Implement core estimate creation and dashboard status overview MVP

## Phase 1: Project Scaffolding & Dashboard Shell
- [~] Task: Initialize Next.js project with TypeScript, Tailwind, and Shadcn UI
- [ ] Task: Set up core layouts (sidebar/navbar) with a "Modern & Vibrant" feel (Slate & Safety Orange)
- [ ] Task: Implement Dashboard Home with summary cards (Pending, Approved, Paid)
- [ ] Task: Create a mock API/Store using Zustand to hold initial estimate data
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Project Scaffolding & Dashboard Shell' (Protocol in workflow.md)

## Phase 2: Estimate Creation Workflow
- [ ] Task: Implement "New Estimate" page with React Hook Form and Zod validation
- [ ] Task: Create Line Item component with real-time price calculations
- [ ] Task: Implement Step-by-step wizard flow for estimate creation
- [ ] Task: Integrate TanStack Query for saving/loading estimates to the state/mock-backend
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Estimate Creation Workflow' (Protocol in workflow.md)

## Phase 3: Document Export & History
- [ ] Task: Implement Estimate History list with search and filtering
- [ ] Task: Integrate jspdf for basic branded PDF export
- [ ] Task: Implement Document Preview before download
- [ ] Task: Final responsive polish for mobile field work
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Document Export & History' (Protocol in workflow.md)