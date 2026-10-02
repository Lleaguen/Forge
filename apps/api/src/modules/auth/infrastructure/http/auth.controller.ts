import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  UseGuards,
  Req,
  Res,
  Request,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { RegisterUserUseCase } from '@/modules/auth/application/use-cases/register-user.use-case';
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { OAuthLoginUseCase } from '@/modules/auth/application/use-cases/oauth-login.use-case';
import { ValidateBody } from '@/shared/decorators/validation.decorator';
import { ResponseUtil } from '@/shared/utils/response.util';
import { RegisterUserSchema } from '@/shared/zod/auth/register-user.schema';
import { LoginSchema } from '@/shared/zod/auth/login.schema';
import type { RegisterUserDto } from '@/modules/auth/application/dtos/register-user.dto';
import type { LoginDto } from '@/modules/auth/application/dtos/login.dto';
import { RefreshTokenUseCase } from '@/modules/auth/application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { GoogleAuthGuard } from '../security/google-auth.guard';
import { GitHubAuthGuard } from '../security/github-auth.guard';
import { PrismaService } from '@/shared/database/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUseCase,
    private readonly oauthLoginUseCase: OAuthLoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly prisma: PrismaService,
  ) {}

  // ──────────────────────────────────────────────
  // Email / Password
  // ──────────────────────────────────────────────

  @Post('register')
  @ValidateBody(RegisterUserSchema)
  async register(
    @Body() body: RegisterUserDto,
    @Res({ passthrough: true }) response: any,
  ) {
    const result = await this.registerUser.execute(body);
    this.setAuthCookies(response, result.accessToken, result.refreshToken);
    return ResponseUtil.success(
      { accessToken: result.accessToken, refreshToken: result.refreshToken, user: result.user },
      'Account created successfully',
    );
  }

  @Post('login')
  @ValidateBody(LoginSchema)
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: any,
  ) {
    const result = await this.loginUser.execute(body);
    this.setAuthCookies(response, result.accessToken, result.refreshToken);
    return ResponseUtil.success({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  }

  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) response: any) {
    const refreshToken = req.cookies?.auth_refresh_token;
    if (!refreshToken) throw new NotFoundException('Refresh token not found');

    const result = await this.refreshTokenUseCase.execute({ refreshToken });
    this.setAuthCookies(response, result.accessToken, result.refreshToken);
    return ResponseUtil.success(null, 'Tokens refreshed successfully');
  }

  @Post('logout')
  async logout(@Req() _req: any, @Res({ passthrough: true }) response: any) {
    response.clearCookie('auth_access_token', { path: '/' });
    response.clearCookie('auth_refresh_token', { path: '/' });
    return ResponseUtil.success(null, 'Logout successful');
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Request() req: any) {
    const userId = req.user.sub;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { memberships: { include: { organization: true } } },
    });

    if (!user) throw new NotFoundException('User not found');

    const organization = user.memberships[0]?.organization;

    return ResponseUtil.success({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      organization: organization
        ? { id: organization.id, name: organization.name }
        : null,
      createdAt: user.createdAt.toISOString(),
    });
  }

  @Patch('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updateAvatar(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    const base64 = file.buffer.toString('base64');
    const avatarUrl = `data:${file.mimetype};base64,${base64}`;

    await this.prisma.user.update({
      where: { id: req.user.sub },
      data: { avatarUrl },
    });

    return ResponseUtil.success({ avatarUrl }, 'Profile picture updated successfully');
  }

  // ──────────────────────────────────────────────
  // OAuth — Google
  // ──────────────────────────────────────────────

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    // Passport redirige a Google automáticamente
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: any, @Res() res: Response) {
    return this.handleOAuthCallback(req, res);
  }

  // ──────────────────────────────────────────────
  // OAuth — GitHub
  // ──────────────────────────────────────────────

  @Get('github')
  @UseGuards(GitHubAuthGuard)
  githubLogin() {
    // Passport redirige a GitHub automáticamente
  }

  @Get('github/callback')
  @UseGuards(GitHubAuthGuard)
  async githubCallback(@Req() req: any, @Res() res: Response) {
    return this.handleOAuthCallback(req, res);
  }

  // ──────────────────────────────────────────────
  // Helpers privados
  // ──────────────────────────────────────────────

  private async handleOAuthCallback(req: any, res: Response) {
    const result = await this.oauthLoginUseCase.execute(req.user);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? 'none' : 'lax') as 'none' | 'lax',
      path: '/',
    };

    res.cookie('auth_access_token', result.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('auth_refresh_token', result.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3001';
    return res.redirect(`${frontendUrl}/auth/callback?success=true`);
  }

  private setAuthCookies(
    response: any,
    accessToken: string,
    refreshToken?: string,
  ) {
    const isProduction = process.env.NODE_ENV === 'production';
    const base = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
    };

    response.cookie('auth_access_token', accessToken, {
      ...base,
      maxAge: 15 * 60 * 1000,
    });

    if (refreshToken) {
      response.cookie('auth_refresh_token', refreshToken, {
        ...base,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
  }
}
