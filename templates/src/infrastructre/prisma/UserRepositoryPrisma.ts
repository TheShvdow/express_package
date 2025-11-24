import { User } from "../../core/entities/User";
import { UserRepository } from "../../types/UserRepository";
import { prisma } from "./client";

export class UserRepositoryPrisma implements UserRepository {
  async create(user: User) {
    return prisma.user.create({ data: user });
  }

  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }
}
