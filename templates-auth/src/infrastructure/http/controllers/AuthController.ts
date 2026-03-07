import { Request, Response, NextFunction } from "express";
import { AuthService } from "../../../application/services/AuthService";

export class AuthController {
  private service = new AuthService();

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await this.service.register(req.body));
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await this.service.login(req.body));
    } catch (err) {
      next(err);
    }
  };

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await this.service.getMe(req.user!.userId));
    } catch (err) {
      next(err);
    }
  };
}
