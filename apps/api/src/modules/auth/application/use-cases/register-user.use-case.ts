import { UserRepository } from '../../domain/repositories/user.repository';
import { PasswordHasher } from '../ports/password-hasher.port';
import { Email } from '../../domain/value-objects/email.vo';
import { Password } from '../../domain/value-objects/password.vo';
import { User } from '../../domain/entities/user.entity';
import { DomainError } from '@/shared/errors/domain.error';

interface RegisterUserCommand {
  email: string;
  password: string;
}

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(command: RegisterUserCommand): Promise<void> {
    const email = Email.create(command.email);
    const password = Password.create(command.password);

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new DomainError('Email already in use');
    }

    const passwordHash = await this.passwordHasher.hash(
      password.getValue(),
    );

    const user = User.create({
      email,
      passwordHash,
    });

    await this.userRepository.save(user);
  }
}
