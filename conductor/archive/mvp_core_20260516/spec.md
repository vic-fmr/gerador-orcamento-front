# Track Specification: Implement core estimate creation and dashboard status overview MVP

## Overview
This track focuses on delivering the minimum viable product (MVP) for the project estimate manager. Users should be able to land on a dashboard, view their overall financial health/status, and proceed to create a new project estimate.

## User Stories
- **Line Item Selection:** Users choose items from a pre-registered catalog.
- **Predefined Pricing:** Selected items come with a predefined unit price.
- **Flexible Units:** Support for Brazilian measurement units (un, m, m², m³, kg, h, etc.).
- **Rapid Quantity Adjustment:** Users only need to adjust the quantity for selected items.

## Acceptance Criteria
- Dashboard displays summary cards for "Pending", "Approved", and "Paid".
- "New Estimate" button leads to a multi-step form.
- Form allows selecting items from a catalog.
- Each item has a description, unit (un, m, kg, etc.), and unit price.
- Totals are auto-calculated based on selected item's price and user-input quantity.
- "Download PDF" button generates a file with the estimate details.
- Fully responsive on mobile.