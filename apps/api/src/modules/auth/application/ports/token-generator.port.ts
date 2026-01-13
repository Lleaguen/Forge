export interface TokenPayload {
  sub: string;
  email: string;
}

export interface TokenGenerator {
  generateAccessToken(payload: TokenPayload): Promise<string>;
  generateRefreshToken(payload: TokenPayload): Promise<string>;
}
