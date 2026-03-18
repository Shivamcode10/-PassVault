import jwt, { SignOptions } from "jsonwebtoken";

export class JWTUtil {

  private static getSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    return secret;
  }

  static generateToken(userId: string): string {

    const secret = this.getSecret();

    const options: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRE as jwt.SignOptions["expiresIn"]) || "7d"
    };

    return jwt.sign(
      { userId },
      secret,
      options
    );
  }

  static verifyToken(token: string): { userId: string } {

    const decoded = jwt.verify(
      token,
      this.getSecret()
    ) as { userId: string };

    return decoded;
  }

  static generateRefreshToken(userId: string): string {

    const options: SignOptions = {
      expiresIn: "30d"
    };

    return jwt.sign(
      { userId, type: "refresh" },
      this.getSecret(),
      options
    );
  }

}