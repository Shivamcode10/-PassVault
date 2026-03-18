import { Response, NextFunction } from "express";
import { Password } from "../models/Password";
import { CryptoUtil } from "../utils/crypto";
import { AuthRequest } from "../middleware/auth";
import { catchAsync } from "../utils/catchAsync";
import AppError from "../utils/appError";

// ✅ GET ALL PASSWORDS (FIXED: decrypt password)
export const getPasswords = catchAsync(async (req: AuthRequest, res: Response) => {

  const userId = req.user._id;

  const passwordsRaw = await Password.find({ userId })
    .sort({ lastModified: -1 });

  const passwords = passwordsRaw.map((p) => ({
    ...p.toObject(),
    password: CryptoUtil.decrypt(p.encryptedPassword),
  }));

  res.json({ passwords });

});

// ✅ GET PASSWORD BY ID (already correct)
export const getPasswordById = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {

  const { id } = req.params;
  const userId = req.user._id;

  const password = await Password.findOne({ _id: id, userId });

  if (!password) {
    return next(new AppError("Password not found", 404));
  }

  const decryptedPassword = CryptoUtil.decrypt(password.encryptedPassword);

  res.json({
    password: {
      ...password.toObject(),
      password: decryptedPassword,
    },
  });

});

// ✅ CREATE PASSWORD (FIXED: return decrypted password)
export const createPassword = catchAsync(async (req: AuthRequest, res: Response) => {

  const userId = req.user._id;
  const { password, ...rest } = req.body;

  const encryptedPassword = CryptoUtil.encrypt(password);
  const strength = CryptoUtil.calculatePasswordStrength(password);

  const newPassword = new Password({
    userId,
    ...rest,
    encryptedPassword,
    strength,
  });

  await newPassword.save();

  res.status(201).json({
    message: "Password saved successfully",
    password: {
      ...newPassword.toObject(),
      password, // ✅ send plain password
    },
  });

});

// ✅ UPDATE PASSWORD (FIXED: return decrypted password)
export const updatePassword = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {

  const { id } = req.params;
  const userId = req.user._id;

  const passwordDoc = await Password.findOne({ _id: id, userId });

  if (!passwordDoc) {
    return next(new AppError("Password not found", 404));
  }

  const updates = req.body;

  if (updates.password) {
    updates.encryptedPassword = CryptoUtil.encrypt(updates.password);
    updates.strength = CryptoUtil.calculatePasswordStrength(updates.password);
    delete updates.password;
  }

  updates.lastModified = new Date();

  Object.assign(passwordDoc, updates);

  await passwordDoc.save();

  const decryptedPassword = CryptoUtil.decrypt(passwordDoc.encryptedPassword);

  res.json({
    message: "Password updated successfully",
    password: {
      ...passwordDoc.toObject(),
      password: decryptedPassword,
    },
  });

});

// ✅ DELETE PASSWORD (no change needed)
export const deletePassword = catchAsync(async (req: AuthRequest, res: Response, next: NextFunction) => {

  const { id } = req.params;
  const userId = req.user._id;

  const password = await Password.findOneAndDelete({
    _id: id,
    userId,
  });

  if (!password) {
    return next(new AppError("Password not found", 404));
  }

  res.json({
    message: "Password deleted successfully",
  });

});

// ✅ STATS (no change)
export const getPasswordStats = catchAsync(async (req: AuthRequest, res: Response) => {

  const userId = req.user._id;

  const total = await Password.countDocuments({ userId });

  const strong = await Password.countDocuments({
    userId,
    strength: { $in: ["strong", "very-strong"] },
  });

  const weak = await Password.countDocuments({
    userId,
    strength: "weak",
  });

  res.json({
    total,
    strong,
    weak,
  });

});