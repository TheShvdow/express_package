import { UserRepository } from "../../types/UserRepository";
import { AppError } from "../errors/AppError";

export class GetMeUseCase {
  constructor(private repo: UserRepository) {}

  async execute(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return user;
  }
}
