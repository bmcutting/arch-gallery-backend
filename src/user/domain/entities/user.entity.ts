import { Experience } from './experience.entity';
import { UserSkill } from './user-skill.entity';

interface Props {
  id: string;
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  shortBio: string | null;
  longBio: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  website: string | null;
  location: string | null;
  experienceYears: number | null;
  specialization: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  languages: string[];
  skills: UserSkill[];
  experiences: Experience[];
  isActive: boolean;
  createdAt?: Date;
  deletedAt: Date | null;
}

export class User {
  readonly id: string;
  readonly createdAt: Date;
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  shortBio: string | null;
  longBio: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  website: string | null;
  location: string | null;
  experienceYears: number | null;
  specialization: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  skills: UserSkill[];
  experiences: Experience[];
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
    this.phoneNumber = props.phoneNumber;
    this.shortBio = props.shortBio;
    this.longBio = props.longBio;
    this.skills = props.skills;
    this.experiences = props.experiences;
    this.profileImageUrl = props.profileImageUrl;
    this.coverImageUrl = props.coverImageUrl;
    this.website = props.website;
    this.location = props.location;
    this.experienceYears = props.experienceYears;
    this.specialization = props.specialization;
    this.instagramUrl = props.instagramUrl;
    this.twitterUrl = props.twitterUrl;
    this.linkedinUrl = props.linkedinUrl;
    this.languages = props.languages;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt ?? new Date();
    this.deletedAt = props.deletedAt;
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

  getUserName(): string {
    return this.userName;
  }

  getPhoneNumber(): string | null {
    return this.phoneNumber;
  }

  getShortBio(): string | null {
    return this.shortBio;
  }

  getLongBio(): string | null {
    return this.longBio;
  }

  getWebsite(): string | null {
    return this.website;
  }

  getSkills(): UserSkill[] {
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
  setPassword(password: string): void {
    this.password = password;
  }

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

  setSkill(skills: UserSkill[]): void {
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
