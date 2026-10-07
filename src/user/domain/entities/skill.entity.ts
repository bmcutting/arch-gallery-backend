import { SkillScope } from '../enums/skill-scope';

export interface SkillProps {
  id: string;
  scope: SkillScope;
  displayName: string;
  normalizedName: string;
  createdById: string | null;
  createdAt?: Date;
  isActive?: boolean;
  deletedAt?: Date | null;
}

export class Skill {
  readonly id: string;
  readonly createdAt: Date;
  scope: SkillScope;
  displayName: string;
  normalizedName: string;
  createdById: string | null;
  isActive: boolean;
  deletedAt: Date | null;

  constructor(props: SkillProps) {
    this.id = props.id;
    this.createdAt = props.createdAt ?? new Date();
    this.scope = props.scope;
    this.displayName = props.displayName;
    this.normalizedName = props.normalizedName;
    this.createdById = props.createdById;
    this.isActive = props.isActive ?? true;
    this.deletedAt = props.deletedAt ?? null;
  }

  getId(): string {
    return this.id;
  }

  getDisplayName(): string {
    return this.displayName;
  }

  getNormalizedName(): string {
    return this.normalizedName;
  }

  getScope(): SkillScope {
    return this.scope;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getCreatedById(): string | null {
    return this.createdById;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getDeletedAt(): Date | null {
    return this.deletedAt;
  }

  isGlobal(): boolean {
    return this.scope === SkillScope.GLOBAL;
  }

  setScope(scope: SkillScope): void {
    this.scope = scope;
  }

  reactivate(): void {
    this.isActive = true;
    this.deletedAt = null;
  }

  delete(): void {
    this.isActive = false;
    this.deletedAt = new Date();
  }

  // Los dos nombres se cambian juntos o no se cambian: separados pueden discrepar.
  rename(props: { displayName: string; normalizedName: string }): void {
    this.displayName = props.displayName;
    this.normalizedName = props.normalizedName;
  }
}
