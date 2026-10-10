
import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    name: string
    email: string
    status: "Active" | "Inactive"
  }
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authorization = req.headers.authorization

    if (!authorization || !authorization.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication required. Please log in.",
      })
      return
    }

    const token = authorization.slice("Bearer ".length).trim()

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      })
      return
    }

    const secret = process.env.JWT_SECRET

    if (!secret) {
      console.error("JWT_SECRET is not configured.")
      res.status(500).json({
        success: false,
        message: "Authentication is not configured.",
      })
      return
    }

    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"],
    })

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      })
      return
    }

    const user = await User.findById(decoded.sub)

    if (!user || user.status !== "Active") {
  res.status(401).json({
    success: false,
    message: "Your session is invalid or your account is inactive.",
  })
  return
}

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      status: user.status,
    }

    next()
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    })
  }
}