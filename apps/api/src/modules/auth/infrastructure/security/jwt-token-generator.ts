import { JwtService } from '@nestjs/jwt';
import {
  TokenGenerator,
  TokenPayload,
} from '../../application/ports/token-generator.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtTokenGenerator implements TokenGenerator {
  constructor(private readonly jwtService: JwtService) {}

  async generateAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
  }

  async generateRefreshToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
  }

  generate(user: any): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
