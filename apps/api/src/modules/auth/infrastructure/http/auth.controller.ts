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
import { RegisterUserUseCase } from '@/modules/auth/application/use-cases/register-user.use-case';
import { LoginUseCase } from '@/modules/auth/application/use-cases/login.use-case';
import { ValidateBody } from '@/shared/decorators/validation.decorator';
import { ResponseUtil } from '@/shared/utils/response.util';
import { RegisterUserSchema } from '@/shared/zod/auth/register-user.schema';
import { LoginSchema } from '@/shared/zod/auth/login.schema';
import type { RegisterUserDto } from '@/modules/auth/application/dtos/register-user.dto';
import type { LoginDto } from '@/modules/auth/application/dtos/login.dto';
import { RefreshTokenUseCase } from '@/modules/auth/application/use-cases/refresh-token.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout.use-case';
import { LogoutGuard } from '../security/logout.guard';
import { JwtAuthGuard } from '../security/jwt-auth.guard';
import { PrismaService } from '@/shared/database/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUser: RegisterUserUseCase,
    private readonly loginUser: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly prisma: PrismaService,
  ) {}

  @Post('register')
  @ValidateBody(RegisterUserSchema)
  async register(@Body() body: RegisterUserDto, @Res({ passthrough: true }) response: any) {
    const result = await this.registerUser.execute(body);

    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/'
    };

    response.cookie('auth_access_token', result.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    response.cookie('auth_refresh_token', result.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return ResponseUtil.success({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user
    }, 'Account created successfully');
  }

  @Post('login')
  @ValidateBody(LoginSchema)
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) response: any) {
    const result = await this.loginUser.execute(body);

    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/'
    };

    response.cookie('auth_access_token', result.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    response.cookie('auth_refresh_token', result.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return ResponseUtil.success({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user
    });
  }

  @Post('refresh')
  async refresh(@Req() req: any, @Res({ passthrough: true }) response: any) {
    const refreshToken = req.cookies?.auth_refresh_token;

    if (!refreshToken) {
      throw new NotFoundException('Refresh token not found');
    }

    const result = await this.refreshTokenUseCase.execute({ refreshToken });

    const isProduction = process.env.NODE_ENV === 'production';

    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/'
    };

    response.cookie('auth_access_token', result.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });

    if (result.refreshToken) {
      response.cookie('auth_refresh_token', result.refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    return ResponseUtil.success(null, 'Tokens refreshed successfully');
  }
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) response: any) {
    // Clear all authentication cookies
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
      include: {
        memberships: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const organization = user.memberships[0]?.organization;

    return ResponseUtil.success({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      organization: organization ? {
        id: organization.id,
        name: organization.name,
      } : null,
      createdAt: user.createdAt.toISOString(),
    });
  }

  @Patch('avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar', {
    storage: memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new BadRequestException('Only image files are allowed'), false);
      }
      cb(null, true);
    },
  }))
  async updateAvatar(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const userId = req.user.sub;

    // Convert to base64 data URL for storage
    // In production, you'd upload to S3/Cloudinary instead
    const base64 = file.buffer.toString('base64');
    const avatarUrl = `data:${file.mimetype};base64,${base64}`;

    await this.prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });

    return ResponseUtil.success({ avatarUrl }, 'Profile picture updated successfully');
  }
}
