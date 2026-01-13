import * as bcrypt from 'bcrypt';
import { PasswordHasher } from '../../application/ports/password-hasher.port';

export class BcryptPasswordHasher implements PasswordHasher {
  async hash(raw: string): Promise<string> {
    return bcrypt.hash(raw, 10);
  }

  async compare(raw: string, hash: string): Promise<boolean> {
    return bcrypt.compare(raw, hash);
  }
}
