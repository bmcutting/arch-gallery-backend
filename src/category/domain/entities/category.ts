interface CategoryProps {
  id: string;
  name: string;
  isActive: boolean;
  createdAt?: Date;
  deletedAt?: Date | null;
}

export class Category {
  readonly id: string;
  readonly createdAt: Date;
  name: string;
  isActive: boolean;
  deletedAt: Date | null;

  constructor(props: CategoryProps) {
    this.id = props.id;
    this.name = props.name;
    this.createdAt = props.createdAt ?? new Date();
    this.isActive = props.isActive;
    this.createdAt = props.createdAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.id;
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

  // Setters
  setName(name: string) {
    this.name = name;
  }

  delete(): void {
    this.isActive = false;
    this.deletedAt = new Date();
  }
}
