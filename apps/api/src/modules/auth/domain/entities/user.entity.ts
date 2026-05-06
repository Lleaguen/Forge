import { Email } from '../value-objects/email.vo';
import { UserId } from '../value-objects/user-id.vo';

type UserRole = 'ADMIN' | 'MEMBER';

interface CreateUserProps {
  id?: UserId;
  email: Email;
  passwordHash: string;
  fullName?: string;
  role?: UserRole;
  avatarUrl?: string;
  createdAt?: Date;
}

export class User {
  private readonly id: UserId;
  private email: Email;
  private passwordHash: string;
  private fullName: string;
  private role: UserRole;
  private avatarUrl?: string;
  private readonly createdAt: Date;

  private constructor(props: CreateUserProps) {
    this.id = props.id ?? UserId.create();
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.fullName = props.fullName ?? '';
    this.role = props.role ?? 'MEMBER';
    this.avatarUrl = props.avatarUrl;
    this.createdAt = props.createdAt ?? new Date();
  }

  static create(props: CreateUserProps): User {
    return new User(props);
  }

  changePassword(newPasswordHash: string): void {
    this.passwordHash = newPasswordHash;
  }

  updateProfile(fullName?: string, avatarUrl?: string): void {
    if (fullName !== undefined) {
      this.fullName = fullName;
    }
    if (avatarUrl !== undefined) {
      this.avatarUrl = avatarUrl;
    }
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

  getFullName(): string {
    return this.fullName;
  }

  getRole(): UserRole {
    return this.role;
  }

  getAvatarUrl(): string | undefined {
    return this.avatarUrl;
  }

  getOrganization(): any {
    // TODO: Implementar cuando se agregue la relación con Organization
    return undefined;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
