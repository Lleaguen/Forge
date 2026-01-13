import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';

interface CreateUserProps {
  id?: UserId;
  email: Email;
  passwordHash: string;
  createdAt?: Date;
}

export class User {
  private readonly id: UserId;
  private email: Email;
  private passwordHash: string;
  private readonly createdAt: Date;

  private constructor(props: CreateUserProps) {
    this.id = props.id ?? UserId.create();
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.createdAt = props.createdAt ?? new Date();
  }

  static create(props: CreateUserProps): User {
    return new User(props);
  }

  changePassword(newPasswordHash: string): void {
    this.passwordHash = newPasswordHash;
  }

  getId(): UserId {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getPasswordHash(): string {
    return this.passwordHash;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
