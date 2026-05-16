# Track Specification: Implement core estimate creation and dashboard status overview MVP

## Overview
This track focuses on delivering the minimum viable product (MVP) for the project estimate manager. Users should be able to land on a dashboard, view their overall financial health/status, and proceed to create a new project estimate.

## User Stories
- **Rapid Estimate Creation:** Users can quickly start a new estimate and add line items.
- **Status Overview:** Dashboard shows summaries of pending, approved, and paid budgets.
- **Branded Export:** Users can download a basic PDF version of their estimates.

## Technical Requirements
- **Next.js App Router** for routing and page structure.
- **Shadcn UI** for the dashboard and form components.
- **Zustand** for local dashboard and form state.
- **TanStack Query** for fetching existing estimates (mocked or from backend).
- **React Hook Form + Zod** for estimate creation forms.
- **jspdf** for basic PDF export.

## Acceptance Criteria
- Dashboard displays summary cards for "Pending", "Approved", and "Paid".
- "New Estimate" button leads to a multi-step form.
- Form allows adding line items with auto-calculation of totals.
- "Download PDF" button generates a file with the estimate details.
- Fully responsive on mobile.