import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

/* ================= INTERFACE ================= */

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  masterPassword?: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;

  // 🔐 SECURITY
  isTwoFactorEnabled: boolean;
  otp?: string;
  otpExpiry?: Date;
  autoLockEnabled: boolean;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

/* ================= SCHEMA ================= */

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },

    masterPassword: {
      type: String,
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },

    /* ================= SECURITY ================= */

    // 🔐 2FA
    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    otp: {
      type: String,
      select: false,
    },

    otpExpiry: {
      type: Date,
      select: false,
    },

    // ⏱️ AUTO LOCK
    autoLockEnabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ================= PASSWORD HASH ================= */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* ================= PASSWORD COMPARE ================= */

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

/* ================= EXPORT ================= */

export const User = mongoose.model<IUser>("User", userSchema);