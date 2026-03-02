interface Props {
  id: string;
  userId: string;
  projectId: string;
  isActive: boolean;
  createdAt?: Date;
  deletedAt?: Date | null;
}

export class Like {
  readonly id: string;
  readonly createdAt: Date;
  userId: string;
  projectId: string;
  isActive: boolean;
  deletedAt: Date | null;

  constructor(props: Props) {
    this.id = props.id;
    this.userId = props.userId;
    this.projectId = props.projectId;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }

  //Getters
  getId(): string {
    return this.id;
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
