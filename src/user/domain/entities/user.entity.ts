interface Props {
  id: string;
  email: string;
  password: string;
  userName: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  bio: string;
  profileImageUrl: string;
  website: string;
  location: string;
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
  bio: string;
  profileImageUrl: string;
  website: string;
  location: string;
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
    this.bio = props.bio;
    this.profileImageUrl = props.profileImageUrl;
    this.website = props.website;
    this.location = props.location;
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

  getBio(): string | null {
    return this.bio;
  }

  getProfileImageUrl(): string | null {
    return this.profileImageUrl;
  }

  getLocation(): string | null {
    return this.location;
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

  setBio(bio: string) {
    this.bio = bio;
  }

  setProfileImageUrl(profileImageUrl: string) {
    this.profileImageUrl = profileImageUrl;
  }

  setLocation(location: string) {
    this.location = location;
  }

  delete(): void {
    this.isActive = false;
    this.deletedAt = new Date();
  }
}
