# Codebase Contract — Module Development Rules

## File Ownership

Dashboard developer may ONLY modify:
/src/modules/dashboard/

Patient developer may ONLY modify:
/src/modules/patients/

Appointment developer may ONLY modify:
/src/modules/appointments/

No developer may modify:
* shared UI components
* API clients
* theme files
* routing system
* backend code

These are core architecture files.

---

## Shared Component Usage

All UI components must be imported from:
../../components/ui

Available shared components:
* Button
* Card
* Badge
* Modal
* Input
* SearchInput
* Table
* StatCard
* EmptyState
* Toast
* PageHeader
* DatePicker

Each component must have a clearly defined prop API.

Example usage:
```javascript
<Button variant="primary" onClick={handleSave}>
Save Patient
</Button>
```

---

# API Client Usage

Developers must never write raw fetch calls.

All API interactions must go through the API layer.

Example imports:
../../api/patients
../../api/appointments
../../api/dashboard
../../api/followups
../../api/visits

Each API function must:
* return a Promise
* support loading states
* support error states

Example:
```
const { data, loading, error } = usePatients()
```

---

# Theme Usage

Design tokens must come from:
../../styles/theme

or use CSS variables from:
globals.css

This ensures visual consistency across modules.

---

# Utilities

Utilities must be imported from:
../../utils/formatters
../../utils/constants

Examples include:
* currency formatting
* phone formatting
* status constants

---

# Routing

Routes are defined in:
App.jsx

Routes include:
/ → DashboardPage
/patients → PatientsPage
/patients/:id → handled inside patients module
/appointments → AppointmentsPage

Developers must not modify routing.

---

# Module Entry Point Rule

Each module must export its main page component from:
index.jsx

Example:
```
export default PatientsPage
```

---

# Status Values

Status values must be imported from:
utils/constants

Example:
```
APPOINTMENT_STATUS_CONFIRMED
APPOINTMENT_STATUS_CANCELLED
FOLLOWUP_REQUIRED
```

Hardcoding status values is not allowed.

---

# Coding Patterns

Developers must follow these patterns:
* React functional components
* React hooks
* loading states during API calls
* error handling
* EmptyState component for empty lists
* Toast component for feedback

---

# UI Standards

All UI must follow the design system.

Requirements:
* clear typography hierarchy
* card-based layouts
* clean medical dashboard style
* responsive layout

---

# Localization & Context Rules

User-facing text must be English.

Application context is India, so follow:
* ₹ currency format
* 10 digit phone numbers
* medical terminology appropriate for clinics
