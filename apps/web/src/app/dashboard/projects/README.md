# Task Management - Hexagonal Architecture

This module implements professional task creation following hexagonal/clean architecture principles.

## Architecture Structure

```
apps/web/src/app/dashboard/projects/
├── components/                 # Presentation Layer (UI Components)
│   ├── CreateTaskModal.tsx    # Modal wrapper (15 lines)
│   └── TaskForm.tsx           # Form component (clean, no business logic)
├── application/               # Application Layer (Use Cases & Services)
│   ├── task-form.service.ts   # Business logic for task form operations
│   └── use-task-form.hook.ts  # React hook for form state management
└── domain/                    # Domain Layer (Pure business rules)
    ├── task-form.types.ts     # Type definitions and interfaces
    ├── task-form.constants.ts # Business constants and configuration
    └── task-form.validations.ts # Zod schemas and validation rules
```

## Key Features

### ✅ Clean Architecture
- **Domain Layer**: Pure business logic, no framework dependencies
- **Application Layer**: Use cases and services, orchestrates domain logic
- **Presentation Layer**: React components, minimal logic, focused on UI

### ✅ Separation of Concerns
- **No business logic in TSX files** - Components only handle UI rendering
- **Validations separated** - Zod schemas in dedicated validation files
- **Constants extracted** - All magic numbers and configuration centralized
- **Types isolated** - Interface definitions in dedicated type files

### ✅ Professional Task Management
- **Categories**: Development, Design, Architecture, Testing, etc.
- **Priorities**: Low, Medium, High, Urgent, Critical
- **Tags System**: Smart validation, normalization, duplicate prevention
- **Estimated Hours**: Decimal support with proper validation
- **Due Dates**: DateTime picker with proper formatting
- **Rich Descriptions**: Multi-line text with character limits

### ✅ Robust Validation
- **Client-side validation** using Zod schemas
- **Real-time feedback** for form errors
- **Tag validation** with smart error handling
- **Business rules enforcement** (max tags, character limits, etc.)

### ✅ Error Handling
- **Graceful error handling** with user-friendly messages
- **Loading states** during form submission
- **Optimistic updates** with proper rollback
- **Toast notifications** for success/error feedback

## Usage

```tsx
import CreateTaskModal from './components/CreateTaskModal'

// In your component
<CreateTaskModal
  projectId={projectId}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSuccess={() => {
    setIsModalOpen(false)
    // Handle success (refresh data, show notification, etc.)
  }}
/>
```

## Business Rules

### Task Creation
- Title: Required, 1-200 characters
- Description: Optional, max 2000 characters
- Category: Required, defaults to DEVELOPMENT
- Priority: Required, defaults to MEDIUM
- Estimated Hours: Optional, 0.1-1000 hours
- Due Date: Optional, datetime format
- Tags: Optional, max 10 tags, 50 chars each

### Tag Management
- Automatic normalization (lowercase, trimmed)
- Duplicate prevention
- Real-time validation
- Visual feedback for limits

## Technical Details

### Dependencies
- React Hook Form + Zod for form management
- TanStack Query for API integration
- Custom error handling system
- Reusable UI components

### Performance
- Optimized re-renders with proper memoization
- Efficient form validation
- Smart tag input with debouncing
- Minimal bundle size impact

### Accessibility
- Proper form labels and ARIA attributes
- Keyboard navigation support
- Screen reader friendly
- Focus management

This implementation follows senior-level architectural patterns and is designed for scalability and maintainability.