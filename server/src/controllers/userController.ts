import { Request, Response } from 'express';
import { User } from '../models/User';
import { Password, IPassword } from '../models/Password'; // <-- CORRECTED IMPORT
import { AuthRequest } from '../middleware/auth';
import { CryptoUtil } from '../utils/crypto';

export const getUserSettings = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -masterPassword')
      .populate('passwords');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      settings: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        hasMasterPassword: !!user.masterPassword,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to get user settings' });
  }
};

export const updatePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update password' });
  }
};

export const setMasterPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { masterPassword, confirmPassword } = req.body;
    const userId = req.user._id;

    if (masterPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Encrypt and save master password
    user.masterPassword = CryptoUtil.encrypt(masterPassword);
    await user.save();

    res.json({ message: 'Master password set successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to set master password' });
  }
};

export const verifyMasterPassword = async (req: AuthRequest, res: Response) => {
  try {
    const { masterPassword } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId).select('+masterPassword');
    if (!user || !user.masterPassword) {
      return res.status(404).json({ message: 'Master password not set' });
    }

    // Decrypt and verify master password
    const decryptedMasterPassword = CryptoUtil.decrypt(user.masterPassword);
    
    if (decryptedMasterPassword !== masterPassword) {
      return res.status(400).json({ message: 'Invalid master password' });
    }

    res.json({ message: 'Master password verified successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to verify master password' });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const { password, confirmation } = req.body;
    const userId = req.user._id;

    if (confirmation !== 'DELETE') {
      return res.status(400).json({ message: 'Invalid confirmation text' });
    }

    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Delete user and all associated passwords
    await Promise.all([
      User.findByIdAndDelete(userId),
      // Passwords will be automatically deleted due to the user reference
    ]);

    res.json({ message: 'Account deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete account' });
  }
};

export const exportData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { masterPassword } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get all passwords
    const passwords = await Password.find({ userId });

    // Decrypt passwords if master password is provided
    const decryptedPasswords = passwords.map((pwd: IPassword) => { // <-- CORRECTED TYPE
      const decrypted = masterPassword 
        ? CryptoUtil.decrypt(pwd.encryptedPassword, masterPassword)
        : '***';

      return {
        website: pwd.website,
        username: pwd.username,
        password: decrypted,
        category: pwd.category,
        notes: pwd.notes,
        url: pwd.url,
        tags: pwd.tags,
        isFavorite: pwd.isFavorite,
        createdAt: pwd.createdAt,
        lastModified: pwd.lastModified
      };
    });

    const exportData = {
      user: {
        name: user.name,
        email: user.email,
        exportDate: new Date().toISOString()
      },
      passwords: decryptedPasswords
    };

    res.json({
      message: 'Data exported successfully',
      data: exportData
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to export data' });
  }
};

// 🔐 TOGGLE 2FA
export const toggle2FA = async (req: AuthRequest, res: Response) => {
  try {
    const { enabled } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { isTwoFactorEnabled: enabled },
      { new: true }
    );

    res.json({
      message: "2FA updated successfully",
      isTwoFactorEnabled: user?.isTwoFactorEnabled,
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// 🔐 TOGGLE AUTO LOCK
export const toggleAutoLock = async (req: AuthRequest, res: Response) => {
  try {
    const { enabled } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { autoLockEnabled: enabled },
      { new: true }
    );

    res.json({
      message: "AutoLock updated successfully",
      autoLockEnabled: user?.autoLockEnabled,
    });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};