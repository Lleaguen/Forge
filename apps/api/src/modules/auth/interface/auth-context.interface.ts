export interface AuthContext {
  userId: string;
  email: string;
  organizationId?: string;
  roles: string[];
  permissions: string[];
}
