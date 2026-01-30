export interface JwtPayload {
  sub: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  iat?: number;
  exp?: number;
}
