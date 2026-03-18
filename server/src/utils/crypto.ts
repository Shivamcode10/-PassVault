import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 32;

export class CryptoUtil {

  private static getEncryptionKey(): Buffer {
    const key = process.env.ENCRYPTION_KEY;

    if (!key || key.length !== 32) {
      throw new Error("ENCRYPTION_KEY must be 32 characters long");
    }

    return Buffer.from(key);
  }

  static encrypt(text: string, masterPassword?: string): string {
    try {

      const baseKey = this.getEncryptionKey();

      const key = masterPassword
        ? crypto.pbkdf2Sync(masterPassword, baseKey, 100000, 32, "sha256")
        : baseKey;

      const iv = crypto.randomBytes(IV_LENGTH);
      const salt = crypto.randomBytes(SALT_LENGTH);

      const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

      cipher.setAAD(salt);

      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");

      const tag = cipher.getAuthTag();

      const result = {
        iv: iv.toString("hex"),
        salt: salt.toString("hex"),
        tag: tag.toString("hex"),
        encryptedData: encrypted
      };

      return Buffer.from(JSON.stringify(result)).toString("base64");

    } catch {
      throw new Error("Encryption failed");
    }
  }

  static decrypt(encryptedText: string, masterPassword?: string): string {
    try {

      const baseKey = this.getEncryptionKey();

      const key = masterPassword
        ? crypto.pbkdf2Sync(masterPassword, baseKey, 100000, 32, "sha256")
        : baseKey;

      const data = JSON.parse(
        Buffer.from(encryptedText, "base64").toString()
      );

      const iv = Buffer.from(data.iv, "hex");
      const salt = Buffer.from(data.salt, "hex");
      const tag = Buffer.from(data.tag, "hex");

      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

      decipher.setAAD(salt);
      decipher.setAuthTag(tag);

      let decrypted = decipher.update(data.encryptedData, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;

    } catch {
      throw new Error("Decryption failed");
    }
  }

  static calculatePasswordStrength(
    password: string
  ): "weak" | "medium" | "strong" | "very-strong" {

    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;

    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return "weak";
    if (strength <= 4) return "medium";
    if (strength <= 6) return "strong";

    return "very-strong";
  }

}