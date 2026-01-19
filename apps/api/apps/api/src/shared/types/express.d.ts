import { AuthContext } from '@/modules/auth/interfaces/auth-context.interface';

declare global {
  namespace Express {
    interface Request {
      authContext?: AuthContext;
    }
  }
}
