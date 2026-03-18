import { Request, Response } from 'express';
import { User } from '../models/User';
import { JWTUtil } from '../utils/jwt';
import { CryptoUtil } from '../utils/crypto';
import { sendOTP } from '../utils/sendEmail'; // ✅ NEW

/* ================= HELPER ================= */

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ================= REGISTER ================= */

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, masterPassword } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = new User({
      name,
      email,
      password,
      masterPassword: masterPassword
        ? CryptoUtil.encrypt(masterPassword)
        : undefined,
    });

    await user.save();

    const token = JWTUtil.generateToken(user._id.toString());

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Registration failed' });
  }
};

/* ================= LOGIN (UPDATED WITH 2FA) ================= */

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    /* 🔐 2FA CHECK */
    if (user.isTwoFactorEnabled) {
      const otp = generateOTP();

      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

      await user.save();

      await sendOTP(user.email, otp);

      return res.json({
        message: 'OTP sent to your email',
        requires2FA: true,
        userId: user._id,
      });
    }

    /* NORMAL LOGIN */
    user.lastLogin = new Date();
    await user.save();

    const token = JWTUtil.generateToken(user._id.toString());

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
      },
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Login failed' });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email }).select('+otp +otpExpiry');

    if (!user || !user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: 'OTP not found' });
    }

    // check expiry
    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // check match
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // clear OTP
    user.otp = undefined;
    user.otpExpiry = undefined;
    user.lastLogin = new Date();

    await user.save();

    const token = JWTUtil.generateToken(user._id.toString());

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
      },
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message || 'OTP verification failed' });
  }
};

/* ================= LOGOUT ================= */

export const logout = async (req: Request, res: Response) => {
  try {
    res.json({ message: 'Logout successful' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Logout failed' });
  }
};

/* ================= PROFILE ================= */

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select(
      '-password -masterPassword'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        isTwoFactorEnabled: user.isTwoFactorEnabled, // ✅ ADDED
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to get profile' });
  }
};

/* ================= UPDATE PROFILE ================= */

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, email, avatar } = req.body;
    const userId = req.user._id;

    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: userId },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, avatar },
      { new: true, runValidators: true }
    ).select('-password -masterPassword');

    res.json({
      message: 'Profile updated successfully',
      user,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update profile' });
  }
};

/* ================= CHANGE PASSWORD ================= */

export const changePassword = async (req: any, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};