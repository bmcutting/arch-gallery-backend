import { Experience } from './experience.entity';
import { Skill } from './skill.entity';

interface Props {
  id: string;
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  shortBio?: string;
  longBio?: string;
  skills?: Skill[];
  experiences?: Experience[];
  profileImageUrl?: string;
  coverImageUrl?: string;
  website?: string;
  location?: string;
  experienceYears?: number;
  specialization?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  languages?: string[];
  isActive: boolean;
  createdAt?: Date;
  deletedAt?: Date | null;
}

export class User {
  readonly id: string;
  readonly createdAt: Date;
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  shortBio: string;
  longBio: string;
  skills: Skill[];
  experiences: Experience[];
  profileImageUrl: string;
  coverImageUrl: string;
  website: string;
  location: string;
  experienceYears: number;
  specialization: string;
  instagramUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  languages: string[];
  isActive: boolean;
  deletedAt: Date | null;

  constructor(props: Props) {
    this.id = props.id;
    this.email = props.email;
    this.password = props.password;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.userName = props.userName;
    this.phoneNumber = props.phoneNumber ?? '';
    this.shortBio = props.shortBio ?? '';
    this.longBio = props.longBio ?? '';
    this.skills = props.skills ?? [];
    this.experiences = props.experiences ?? [];
    this.profileImageUrl = props.profileImageUrl ?? '';
    this.coverImageUrl = props.coverImageUrl ?? '';
    this.website = props.website ?? '';
    this.location = props.location ?? '';
    this.experienceYears = props.experienceYears ?? 0;
    this.specialization = props.specialization ?? '';
    this.instagramUrl = props.instagramUrl ?? '';
    this.twitterUrl = props.twitterUrl ?? '';
    this.linkedinUrl = props.linkedinUrl ?? '';
    this.languages = props.languages ?? [];
    this.isActive = props.isActive;
    this.createdAt = props.createdAt ?? new Date();
    this.deletedAt = props.deletedAt ?? null;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
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

  getUserName(): string | null {
    return this.userName;
  }

  getPhoneNumber(): string | null {
    return this.phoneNumber;
  }

  getShortBio(): string {
    return this.shortBio;
  }

  getLongBio(): string {
    return this.longBio;
  }

  getSkills(): Skill[] {
    return this.skills;
  }

  getExperiences(): Experience[] {
    return this.experiences;
  }

  getProfileImageUrl(): string | null {
    return this.profileImageUrl;
  }

  getCoverImageUrl(): string | null {
    return this.coverImageUrl;
  }

  getLocation(): string | null {
    return this.location;
  }

  getSpecialization(): string | null {
    return this.specialization;
  }

  getExperienceYears(): number | null {
    return this.experienceYears;
  }

  getInstagramUrl(): string | null {
    return this.instagramUrl;
  }

  getTwitterUrl(): string | null {
    return this.twitterUrl;
  }

  getLinkedinUrl(): string | null {
    return this.linkedinUrl;
  }

  getLanguages(): string[] {
    return this.languages;
  }

  // Setters
  setEmail(email: string) {
    this.email = email;
  }

  setFirstName(firstName: string) {
    this.firstName = firstName;
  }

  setLastName(lastName: string) {
    this.lastName = lastName;
  }

  setIsActive(isActive: boolean) {
    this.isActive = isActive;
  }

  setUserName(userName: string) {
    this.userName = userName;
  }

  setPhoneNumber(phoneNumber: string) {
    this.phoneNumber = phoneNumber;
  }

  setShortBio(shortBio: string): void {
    this.shortBio = shortBio;
  }

  setLongBio(longBio: string): void {
    this.longBio = longBio;
  }

  setSkill(skills: Skill[]): void {
    this.skills = skills;
  }

  setExperience(experiences: Experience[]): void {
    this.experiences = experiences;
  }

  setProfileImageUrl(profileImageUrl: string) {
    this.profileImageUrl = profileImageUrl;
  }

  setCoverImageUrl(coverImageUrl: string) {
    this.coverImageUrl = coverImageUrl;
  }

  setLocation(location: string) {
    this.location = location;
  }

  setExperienceYears(experienceYears: number) {
    this.experienceYears = experienceYears;
  }

  setSpecialization(specialization: string) {
    this.specialization = specialization;
  }

  setInstagramUrl(url: string) {
    this.instagramUrl = url;
  }
  setTwitterUrl(url: string) {
    this.twitterUrl = url;
  }
  setLinkedinUrl(url: string) {
    this.linkedinUrl = url;
  }
  setLanguages(languages: string[]) {
    this.languages = languages;
  }

  delete(): void {
    this.isActive = false;
    this.deletedAt = new Date();
  }
}
