import { NextFunction, Response } from "express";
import { Unauthorized } from "http-errors";
import { JwtService } from "../utils/jwt.service";
import UserSchema from "../model/user.model";
import { AuthRequest } from "../types/auth";

export default class ProtectedMiddleware extends JwtService {
  public protected = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.access_token;
      if (!token) throw new Unauthorized("Unauthorized");

      const payload: any = this.verifyAccessToken(token);
      if (!payload?.userId) throw new Unauthorized("Unauthorized");

      const user = await UserSchema.findById(payload.userId);
      if (!user) throw new Unauthorized("Unauthorized");

      req.payload = payload;
      next();
    } catch (error) {
      next(error);
    }
  };
}
