import { User } from 'src/user/domain/entities/user.entity';

interface Props {
  id: string;
  title: string;
  description: string;
  imagesUrl?: string[];
  user: User;
  isActive: boolean;
  createdAt?: Date;
  deletedAt?: Date | null;
}

export class Project {
  readonly id: string;
  readonly createdAt: Date;
  title: string;
  description: string;
  imagesUrl: string[];
  user: User;
  isActive: boolean;
  deletedAt: Date | null;

  constructor(props: Props) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.user = props.user;
    this.imagesUrl = props.imagesUrl ?? [];
    this.isActive = props.isActive;
    this.createdAt = props.createdAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  getDescription(): string {
    return this.description;
  }

  getUser(): User {
    return this.user;
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

  getImagesUrl(): string[] {
    return this.imagesUrl;
  }

  // Setters
  setTitle(title: string) {
    this.title = title;
  }

  setDescription(description: string) {
    this.description = description;
  }

  delete(): void {
    this.isActive = false;
    this.deletedAt = new Date();
  }
}
