interface Props {
  id: string;
  message: string;
  userId: string;
  projectId: string;
  isActive: boolean;
  createdAt?: Date;
  deletedAt?: Date | null;
  user: {
    id: string;
    userName: string;
    profileImageUrl: string;
  };
}

export class Comment {
  readonly id: string;
  readonly createdAt: Date;
  message: string;
  userId: string;
  projectId: string;
  isActive: boolean;
  deletedAt: Date | null;
  user: {
    id: string;
    userName: string;
    profileImageUrl: string;
  };

  constructor(props: Props) {
    this.id = props.id;
    this.message = props.message;
    this.userId = props.userId;
    this.projectId = props.projectId;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
    this.user = props.user;
  }

  //Getters
  getId(): string {
    return this.id;
  }

  getMessage(): string {
    return this.message;
  }

  getProjectId(): string {
    return this.projectId;
  }

  getUserId(): string {
    return this.userId;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  delete(): void {
    this.isActive = false;
    this.deletedAt = new Date();
  }
}
