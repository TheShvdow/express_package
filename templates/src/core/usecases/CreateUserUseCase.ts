import { UserRepository } from "../../types/UserRepository";
import { User } from "../entities/User";
import { AppError } from "../errors/AppError";
import crypto from "crypto";

export class CreateUserUseCase {
  constructor(private repo: UserRepository) {}

  async execute(data: { name: string; email: string }) {
    const existing = await this.repo.findByEmail(data.email);
    if (existing) throw new AppError("User already exists", 400);

    const user = new User(crypto.randomUUID(), data.email, data.name);

    return this.repo.create(user);
  }
}
