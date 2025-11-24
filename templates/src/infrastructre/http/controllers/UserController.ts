import { Request, Response } from "express";
import { UserService } from "../../../application/services/UserService";

export class UserController {
  private service = new UserService();

  create = async (req: Request, res: Response) => {
    const user = await this.service.createUser(req.body);
    res.json(user);
  };
}
