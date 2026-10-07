import { PaginationResult } from 'src/shared/domain/interfaces/pagination';
import { User } from '../entities/user.entity';
import { UserPaginationParams } from '../interfaces/user-pagination';

export interface UserRepository {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByEmailWithPassword(email: string): Promise<User | null>;
  findByIdWithPassword(id: string): Promise<User | null>;
  findByUserName(userName: string): Promise<User | null>;
  findAll(props: UserPaginationParams): Promise<PaginationResult<User>>;
  update(user: User): Promise<void>;
  updatePassword(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
