import { v4 as uuidv4 } from 'uuid';

interface Props {
  id?: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt?: Date;
  revokedAt?: Date | null;
}

export class RefreshToken {
  readonly id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  readonly createdAt: Date;
  revokedAt: Date | null;

  constructor(props: Props) {
    this.id = props.id ?? uuidv4();
    this.userId = props.userId;
    this.token = props.token;
    this.expiresAt = props.expiresAt;
    this.isRevoked = props.isRevoked;
    this.createdAt = props.createdAt ?? new Date();
    this.revokedAt = props.revokedAt ?? null;
  }

  revoke(): void {
    this.isRevoked = true;
    this.revokedAt = new Date();
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isRevoked && !this.isExpired();
  }
}
