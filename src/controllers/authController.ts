
import { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt, { SignOptions } from "jsonwebtoken"
import User from "../models/User"

import { AuthenticatedRequest } from "../middleware/authMiddleware"

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.")
  }

  return secret
}

const createToken = (userId: string): string => {
  const expiresIn = (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"]

  return jwt.sign({}, getJwtSecret(), {
    subject: userId,
    expiresIn,
    algorithm: "HS256",
  })
}

// POST /api/auth/register
export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      })
      return
    }

    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()

    if (cleanName.length < 2 || cleanName.length > 100) {
      res.status(400).json({
        success: false,
        message: "Name must be between 2 and 100 characters.",
      })
      return
    }

    if (
      cleanEmail.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)
    ) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      })
      return
    }

    if (password.length < 8 || password.length > 72) {
      res.status(400).json({
        success: false,
        message: "Password must be between 8 and 72 characters.",
      })
      return
    }

    const existingUser = await User.findOne({ email: cleanEmail })

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      password: hashedPassword,
      status: "Active",
    })

    const token = createToken(user._id.toString())

    res.status(201).json({
      success: true,
      message: "Account registered successfully.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    })
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      })
      return
    }

    console.error("Registration error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to register your account.",
    })
  }
}

// POST /api/auth/login
export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        success: false,
        message: "Email and password are required.",
      })
      return
    }

    const cleanEmail = email.trim().toLowerCase()

    const user = await User.findOne({ email: cleanEmail }).select("+password")

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      })
      return
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    )

    if (!passwordMatches) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      })
      return
    }



    if (user.status !== "Active") {
      res.status(403).json({
        success: false,
        message: "This account is inactive. Please contact support.",
      })
      return
    }

    const token = createToken(user._id.toString())

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    })
  } catch (error: unknown) {
    console.error("Login error:", error)

    res.status(500).json({
      success: false,
      message: "Unable to log in at this time.",
    })
  }

}


export const getMe = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
    })
    return
  }

  res.status(200).json({
    success: true,
    user: req.user,
  })
}