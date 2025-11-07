import { Conflict } from "http-errors";
import UserSchema from "../model/user.model";
import { EncryptAndDecryptService } from "../utils/encrtiption.service";
import { NotFound, Unauthorized } from "http-errors";
import { JwtService } from "../utils/jwt.service";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  static async register({ name, email, password }: RegisterData) {
    const isUserExist = await UserSchema.findOne({ email });
    if (isUserExist) {
      throw new Conflict("A user already exists with this email");
    }
    const hashPassword = await new EncryptAndDecryptService().hashPassword(
      password
    );
    const user = await UserSchema.create({
      name,
      email,
      password: hashPassword,
    });

    return {
      name:user?.name,
      email:user?.email
    };
  }

  static async login({ email, password }: LoginData) {
    const user = await UserSchema.findOne({ email }).select("+password");
    if (!user) throw new NotFound("User not found");

    const isPasswordValid =
      await new EncryptAndDecryptService().comparePassword(
        password,
        user.password
      );
    if (!isPasswordValid) throw new Unauthorized("Invalid credentials");

    const payload = { userId: user._id, email: user.email };

    const jwtService = new JwtService();
    const accessToken = jwtService.generateAccessToken(payload);
    const refreshToken = jwtService.generateRefreshToken(payload);

    return { user, accessToken, refreshToken };
  }

  static async rotateTokens(refreshToken: string) {
    const jwtService = new JwtService();

    const decoded = jwtService.verifyRefreshToken(refreshToken);

    const payload = { userId: decoded.userId, email: decoded.email };
    const accessToken = jwtService.generateAccessToken(payload);
    return { accessToken };
  }
  
  static async getProfile(userId: string) {
    const user = await UserSchema.findById(userId).select("-password -__v");
    if (!user) throw new NotFound("User not found");

    return user;
  }
}
