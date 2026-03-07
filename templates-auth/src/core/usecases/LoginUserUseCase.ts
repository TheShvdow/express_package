import bcrypt from "bcrypt";
import { UserRepository } from "../../types/UserRepository";
import { AppError } from "../errors/AppError";

export class LoginUserUseCase {
  constructor(private repo: UserRepository) {}

  async execute(data: { email: string; password: string }) {
    const user = await this.repo.findByEmail(data.email);
    if (!user) throw new AppError("Invalid credentials", 401);
    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new AppError("Invalid credentials", 401);
    }
    return user;
  }
}
