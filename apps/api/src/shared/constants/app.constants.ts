/**
 * Application-wide constants
 */

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// JWT
export const JWT = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  COOKIE_MAX_AGE: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
} as const;

// Invitation
export const INVITATION = {
  EXPIRY_DAYS: 7,
  TOKEN_LENGTH: 32,
} as const;

// Task
export const TASK = {
  DEFAULT_STATUS: 'TODO',
  DEFAULT_PRIORITY: 'MEDIUM',
  DEFAULT_CATEGORY: 'DEVELOPMENT',
} as const;

// Organization
export const ORGANIZATION = {
  DEFAULT_ROLE: 'MEMBER',
  OWNER_ROLE: 'OWNER',
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
} as const;

// Rate Limiting
export const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 100,
} as const;

// Activity
export const ACTIVITY = {
  DEFAULT_LIMIT: 20,
  PROJECTS_RATIO: 0.5,
  TASKS_RATIO: 0.5,
} as const;

// Notification
export const NOTIFICATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'User not authenticated',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  INVALID_TOKEN: 'Invalid or expired token',
  PROJECT_NOT_FOUND: 'Project not found or access denied',
  TASK_NOT_FOUND: 'Task not found or access denied',
  ORGANIZATION_NOT_FOUND: 'Organization not found',
  INVITATION_NOT_FOUND: 'Invitation not found',
  INVITATION_EXPIRED: 'Invitation has expired',
  INVITATION_ALREADY_ACCEPTED: 'Invitation already accepted',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'Registration successful',
  INVITATION_SENT: 'Invitation sent successfully',
  INVITATION_ACCEPTED: 'Invitation accepted successfully',
  INVITATION_REJECTED: 'Invitation rejected successfully',
} as const;
