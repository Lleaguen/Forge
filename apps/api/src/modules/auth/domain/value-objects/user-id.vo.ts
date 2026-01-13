import { randomUUID } from 'crypto';
import { DomainError } from '@/shared/errors/domain.error';

export class UserId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(value?: string): UserId {
    if (value && value.trim().length === 0) {
      throw new DomainError('UserId cannot be empty');
    }

    return new UserId(value ?? randomUUID());
  }

  getValue(): string {
    return this.value;
  }

  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
