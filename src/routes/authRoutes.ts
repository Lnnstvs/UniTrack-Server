
import { Router } from "express"
import { register, login, getMe } from "../controllers/authController"
import { requireAuth } from "../middleware/authMiddleware"

const router = Router()

// Public authentication routes
router.post("/register", register)
router.post("/login", login)

// The signed-in user must provide a valid token
router.get("/me", requireAuth, getMe)

export default router