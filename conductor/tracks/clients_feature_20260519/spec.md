# Specification: Clients Page and New Client Feature

## Overview
Implement a comprehensive client management system within the dashboard. This includes a dedicated page to list existing clients and a seamless workflow to add new clients without losing context.

## Functional Requirements
1.  **Client Data Model:**
    *   The frontend must handle the following client attributes: `name`, `email`, `phone`, `address`, and `addressName`.
    *   The `id` generation and management will be handled exclusively by the backend.
2.  **Clients List Page:**
    *   Implement a new route (e.g., `/clients`).
    *   Display the list of clients using a **Data Table** layout.
    *   The table should display the primary client attributes.
3.  **New Client Creation:**
    *   Implement a **Slide-out Panel** (using Shadcn UI Sheet/Drawer) for the "New Client" form.
    *   The panel should be triggered from a primary action button on the Clients List page.
    *   The form must include validation for the required fields.
    *   Upon successful creation, the client list should update to reflect the new entry.

## Non-Functional Requirements
*   **UI/UX:** Use Tailwind CSS and Shadcn UI components (`Table`, `Sheet`, `Form`, `Input`) for consistent dashboard aesthetics.
*   **Forms & Validation:** Use `react-hook-form` and `zod`.

## Out of Scope
*   Editing or Deleting existing clients (can be handled in subsequent tracks).
*   Advanced table pagination/filtering (start with a simple list).