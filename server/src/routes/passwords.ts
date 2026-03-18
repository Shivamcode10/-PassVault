import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { passwordValidation } from "../middleware/validation";

import {
  getPasswords,
  getPasswordStats,
  getPasswordById,
  createPassword,
  updatePassword,
  deletePassword
} from "../controllers/passwordController";

const router = Router();

router.use(authenticate);

router.get("/", getPasswords);

router.get("/stats", getPasswordStats);

router.get("/:id", getPasswordById);

router.post("/", passwordValidation.create, createPassword);

router.put("/:id", passwordValidation.update, updatePassword);

router.delete("/:id", deletePassword);

export default router;