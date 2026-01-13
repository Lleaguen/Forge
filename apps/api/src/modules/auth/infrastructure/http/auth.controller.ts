import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { RegisterUserUseCase } from '@/modules/auth/application/use-cases/register-user.use-case';
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import { RegisterUserSchema } from '@/shared/zod/auth/register-user.schema';
import { LoginSchema } from '@/shared/zod/auth/login.schema';
import type { RegisterUserDto } from '@/modules/auth/application/dtos/register-user.dto';
import type { LoginDto } from '@/modules/auth/application/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUseCase,
  ) {}

  @Post('register')
  @UsePipes(new ZodValidationPipe(RegisterUserSchema))
  register(@Body() body: RegisterUserDto) {
    return this.registerUser.execute(body);
  }

  @Post('login')
  @UsePipes(new ZodValidationPipe(LoginSchema))
  login(@Body() body: LoginDto) {
    return this.loginUser.execute(body);
  }
}
