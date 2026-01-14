import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserId } from '../../domain/value-objects/user-id.vo';
import { PrismaService } from '@/shared/database/prisma.service';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: Email): Promise<User | null> {
    const record = await this.prisma.user.findUnique({
      where: { email: email.getValue() },
    });

    if (!record) return null;

    return User.create({
      id: UserId.fromString(record.id),
      email: Email.create(record.email),
      passwordHash: record.passwordHash,
      createdAt: record.createdAt,
    });
  }

  async save(user: User): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.getId().getValue() },
      update: {
        passwordHash: user.getPasswordHash(),
      },
      create: {
        id: user.getId().getValue(),
        email: user.getEmail().getValue(),
        passwordHash: user.getPasswordHash(),
        createdAt: user.getCreatedAt(),
      },
    });
  }
}
