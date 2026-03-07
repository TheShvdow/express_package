import { User } from "../core/entities/User";

export interface UserRepository {
  create(user: User, hashedPassword: string): Promise<User>;
  findByEmail(email: string): Promise<(User & { password: string }) | null>;
  findById(id: string): Promise<User | null>;
}
