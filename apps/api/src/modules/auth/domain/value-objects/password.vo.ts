import { DomainError } from '@/shared/errors/domain.error';

export class Password {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Password {
    if (!raw) {
      throw new DomainError('Password is required');
    }

    if (raw.length < 8) {
      throw new DomainError('Password must be at least 8 characters long');
    }

    return new Password(raw);
  }

  /**
   * Solo se expone cuando realmente se necesita (ej: hashing)
   */
  getValue(): string {
    return this.value;
  }
}
