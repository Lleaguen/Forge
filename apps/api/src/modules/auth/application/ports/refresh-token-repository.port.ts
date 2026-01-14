import { RefreshToken } from '../../domain/entities/refresh-token.entity';

export interface RefreshTokenRepository {
  save(token: RefreshToken): Promise<void>;
  find(token: string): Promise<RefreshToken | null>;
  revoke(token: string): Promise<void>;
}
