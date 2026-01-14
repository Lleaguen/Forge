import { LoginUseCase } from '../login.use-case';
import { User } from '../../../domain/entities/user.entity';
import { Email } from '../../../domain/value-objects/email.vo';
import { UserId } from '../../../domain/value-objects/user-id.vo';

const repo = {
  findByEmail: jest.fn(),
  save: jest.fn(),
};

const hasher = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const tokenGen = {
  generate: jest.fn(),
};

describe('LoginUseCase', () => {
  it('logs user correctly', async () => {
    const user = User.create({
      id: UserId.create(),
      email: Email.create('test@test.com'),
      passwordHash: 'hashed',
    });

    repo.findByEmail.mockResolvedValue(user);
    hasher.compare.mockResolvedValue(true);
    tokenGen.generate.mockReturnValue({ accessToken: 'a', refreshToken: 'r' });

    const uc = new LoginUseCase(repo as any, hasher as any, tokenGen as any);

    const result = await uc.execute({
      email: 'test@test.com',
      password: '123456',
    });

    expect(result.accessToken).toBe('a');
  });
});
