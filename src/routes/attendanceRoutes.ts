import { Router } from "express"

import {
  getAttendance,
  markAttendance,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendanceController"

const router = Router()

router.get("/", getAttendance)

router.post("/", markAttendance)

router.patch("/:id", updateAttendance)

router.delete("/:id", deleteAttendance)

export default router