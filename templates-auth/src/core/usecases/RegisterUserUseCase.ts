import bcrypt from "bcrypt";
import crypto from "crypto";
import { UserRepository } from "../../types/UserRepository";
import { User } from "../entities/User";
import { AppError } from "../errors/AppError";

export class RegisterUserUseCase {
  constructor(private repo: UserRepository) {}

  async execute(data: { name: string; email: string; password: string }) {
    if (await this.repo.findByEmail(data.email)) {
      throw new AppError("Email already registered", 400);
    }
    const hashed = await bcrypt.hash(data.password, 10);
    return this.repo.create(
      new User(crypto.randomUUID(), data.email, data.name),
      hashed,
    );
  }
}
