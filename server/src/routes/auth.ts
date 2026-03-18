import express from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  verifyOTP
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { changePassword } from '../controllers/authController';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, changePassword);
router.post('/verify-otp', verifyOTP);

export default router;