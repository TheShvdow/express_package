import  {UserRepositoryPrisma}  from "../../infrastructre/prisma/UserRepositoryPrisma"
import { CreateUserUseCase } from "../../core/usecases/CreateUserUseCase";

export class UserService {
  private repo = new UserRepositoryPrisma();

  async createUser(data: { name: string; email: string }) {
    const usecase = new CreateUserUseCase(this.repo);
    return usecase.execute(data);
  }
}
