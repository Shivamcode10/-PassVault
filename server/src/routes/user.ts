import express from 'express';
import {
  getUserSettings,
  updatePassword,
  setMasterPassword,
  verifyMasterPassword,
  deleteAccount,
  exportData
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { authValidation } from '../middleware/validation';
import { toggle2FA, toggleAutoLock } from '../controllers/userController';
const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.get('/settings', getUserSettings);
router.put('/password', authValidation.changePassword, updatePassword);
router.post('/master-password', authValidation.setMasterPassword, setMasterPassword);
router.post('/verify-master-password', verifyMasterPassword);
router.delete('/account', deleteAccount);
router.post('/export-data', exportData);
router.put('/toggle-2fa', toggle2FA);
router.put('/toggle-autolock', toggleAutoLock);

export default router;