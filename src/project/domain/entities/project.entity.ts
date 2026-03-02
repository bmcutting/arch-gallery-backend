import { Category } from 'src/category/domain/entities/category';
import { User } from 'src/user/domain/entities/user.entity';
import { Like } from '../../../like/domain/entities/like.entity';
import { Comment } from '../../../comment/domain/entities/comment.entity';

interface Props {
  id: string;
  title: string;
  description: string;
  year: number;
  imagesUrl?: string[];
  user: User;
  categories?: Category[];
  likes?: Like[];
  comments?: Comment[];
  isActive: boolean;
  createdAt?: Date;
  deletedAt?: Date | null;
}

export class Project {
  readonly id: string;
  readonly createdAt: Date;
  title: string;
  description: string;
  year: number;
  imagesUrl: string[];
  user: User;
  categories: Category[];
  likes: Like[];
  comments: Comment[];
  isActive: boolean;
  deletedAt: Date | null;

  constructor(props: Props) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.year = props.year;
    this.user = props.user;
    this.imagesUrl = props.imagesUrl ?? [];
    this.categories = props.categories ?? [];
    this.likes = props.likes ?? [];
    this.comments = props.comments ?? [];
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

  getCategories(): Category[] {
    return this.categories;
  }

  getLikes(): Like[] {
    return this.likes;
  }

  getComments(): Comment[] {
    return this.comments;
  }

  getYear(): number {
    return this.year;
  }

  // Setters
  setTitle(title: string) {
    this.title = title;
  }
  setDescription(description: string) {
    this.description = description;
  }
  setYear(year: number) {
    this.year = year;
  }

  delete(): void {
    this.isActive = false;
    this.deletedAt = new Date();
  }
}
