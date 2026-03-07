import { User } from "../../core/entities/User";
import { UserRepository } from "../../types/UserRepository";
import { prisma } from "./client";

export class UserRepositoryPrisma implements UserRepository {
  async create(user: User, hashedPassword: string): Promise<User> {
    const r = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: hashedPassword,
      },
    });
    return new User(r.id, r.email, r.name);
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    const u = await prisma.user.findUnique({ where: { id } });
    return u ? new User(u.id, u.email, u.name) : null;
  }
}
