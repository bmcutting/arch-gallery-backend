import { PaginationResult } from 'src/shared/domain/interfaces/pagination-result';
import { User } from '../entities/user.entity';
import { UserPaginationParams } from '../interfaces/user-pagination';

export interface UserRepository {
  create(props: CreateUserProps): Promise<string>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUserName(userName: string): Promise<User | null>;
  findAll(props: UserPaginationParams): Promise<PaginationResult<User>>;
  update(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface CreateUserProps {
  userName: string;
  email: string;
  password: string;
  firtsName: string;
  lastName: string;
}
