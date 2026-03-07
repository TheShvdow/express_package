import { UserRepositoryPrisma } from "../../infrastructure/prisma/UserRepositoryPrisma";
import { RegisterUserUseCase } from "../../core/usecases/RegisterUserUseCase";
import { LoginUserUseCase } from "../../core/usecases/LoginUserUseCase";
import { GetMeUseCase } from "../../core/usecases/GetMeUseCase";
import { User } from "../../core/entities/User";
import { generateToken } from "../../infrastructure/http/utils/jwt";

export class AuthService {
  private repo = new UserRepositoryPrisma();

  async register(data: { name: string; email: string; password: string }) {
    const user = await new RegisterUserUseCase(this.repo).execute(data);
    return { token: generateToken({ userId: user.id, email: user.email }), user };
  }

  async login(data: { email: string; password: string }) {
    const row = await new LoginUserUseCase(this.repo).execute(data);
    const user = new User(row.id, row.email, row.name);
    return { token: generateToken({ userId: user.id, email: user.email }), user };
  }

  async getMe(userId: string) {
    return new GetMeUseCase(this.repo).execute(userId);
  }
}
