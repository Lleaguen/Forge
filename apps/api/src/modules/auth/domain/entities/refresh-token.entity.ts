import { UserId } from '../value-objects/user-id.vo';

export class RefreshToken {
  constructor(
    readonly token: string,
    readonly userId: UserId,
    readonly email: string,
    readonly expiresAt: Date,
    readonly revokedAt?: Date,
  ) {}

  isExpired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  }

  isRevoked(): boolean {
    return !!this.revokedAt;
  }
}