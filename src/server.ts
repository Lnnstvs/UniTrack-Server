import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import connectDB from "./config/db"

import studentRoutes from "./routes/studentRoutes"
import venueRoutes from "./routes/venueRoutes"
import categoryRoutes from "./routes/categoryRoutes"
import eventRoutes from "./routes/eventRoutes"
import registrationRoutes from "./routes/registrationRoutes"
import attendanceRoutes from "./routes/attendanceRoutes"
import dashboardRoutes from "./routes/dashboardRoutes"
import statisticsRoutes from "./routes/statisticsRoutes"
import authRoutes from "./routes/authRoutes"




dotenv.config()

const app = express()

const PORT = process.env.PORT || 8000

app.use(cors())
app.use(express.json())

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "UniTrack API is running.",
  })
})

app.use("/api/students", studentRoutes)
app.use("/api/venues", venueRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/registrations", registrationRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/statistics", statisticsRoutes)
app.use("/api/auth", authRoutes)


const startServer = async (): Promise<void> => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(
      `UniTrack server running on http://localhost:${PORT}`
    )
  })
}

startServer()