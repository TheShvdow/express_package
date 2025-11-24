import { User } from "../core/entities/User";

export interface UserRepository {
  create(user: User): Promise<any>;
  findByEmail(email: string): Promise<User | null>;
}
