import { Router } from "express";

import { getCurrentUser, login, register } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { validateBody } from "../middleware/validateRequest";
import { loginSchema, registerSchema } from "../validators/authSchemas";

const router = Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);
router.get("/me", protect, getCurrentUser);

export const authRoutes = router;
