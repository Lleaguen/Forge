import {
  Body,
  Controller,
  Post,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RegisterUserUseCase } from '@/modules/auth/application/use-cases/register-user.use-case';
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { ZodValidationPipe } from './pipes/zod-validation.pipe';
import { RegisterUserSchema } from '@/shared/zod/auth/register-user.schema';
import { LoginSchema } from '@/shared/zod/auth/login.schema';
import type { RegisterUserDto } from '@/modules/auth/application/dtos/register-user.dto';
import type { LoginDto } from '@/modules/auth/application/dtos/login.dto';
import { RefreshTokenSchema } from '@/shared/zod/auth/refresh-token.schema';
import { RefreshTokenUseCase } from '@/modules/auth/application/use-cases/refresh-token.use-case';
import { RefreshTokenGuard } from '../security/refresh-token.guard';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { LogoutGuard } from '../security/logout.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
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
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  refresh(
    @Body(new ZodValidationPipe(RefreshTokenSchema))
    body: {
      refreshToken: string;
    },
  ) {
    return this.refreshTokenUseCase.execute(body);
  }
  @Post('logout')
  @UseGuards(LogoutGuard)
  async logout(@Req() req: any) {
    const { token } = req.user;
    await this.logoutUseCase.execute(token);
    return { success: true };
  }
}
