import { ExperienceType } from '../enums/experience';

export interface ExperienceProps {
  id: string;
  type: ExperienceType;
  title: string;
  institutionOrCompany: string;
  description?: string;
  startYear: number;
  endYear?: number;
  isCurrent?: boolean;
}

export class Experience {
  readonly id: string;
  type: ExperienceType;
  title: string;
  institutionOrCompany: string;
  description?: string;
  startYear: number;
  endYear?: number;
  isCurrent: boolean;

  constructor(props: ExperienceProps) {
    this.id = props.id;
    this.type = props.type;
    this.title = props.title;
    this.institutionOrCompany = props.institutionOrCompany;
    this.description = props.description;
    this.startYear = props.startYear;
    this.endYear = props.endYear;
    this.isCurrent = props.isCurrent ?? false;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getType(): ExperienceType {
    return this.type;
  }

  getTitle(): string {
    return this.title;
  }

  getInstitutionOrCompany(): string {
    return this.institutionOrCompany;
  }

  getDescription(): string | undefined {
    return this.description;
  }

  getStartYear(): number {
    return this.startYear;
  }

  getEndYear(): number | undefined {
    return this.endYear;
  }

  getIsCurrent(): boolean {
    return this.isCurrent;
  }

  // Setters
  setType(type: ExperienceType): void {
    this.type = type;
  }

  setTitle(title: string): void {
    this.title = title;
  }

  setInstitutionOrCompany(name: string): void {
    this.institutionOrCompany = name;
  }

  setDescription(description: string): void {
    this.description = description;
  }

  setStartYear(year: number): void {
    this.startYear = year;
  }

  setEndYear(year: number): void {
    this.endYear = year;
  }

  setIsCurrent(isCurrent: boolean): void {
    this.isCurrent = isCurrent;
  }
}
