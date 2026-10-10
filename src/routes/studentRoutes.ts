import { Router } from "express"

import {
  getStudents,
  createStudent,
  deleteStudent,
  updateStudentStatus,
} from "../controllers/studentController"

const router = Router()

router.get("/", getStudents)

router.post("/", createStudent)

router.delete("/:id", deleteStudent)

router.patch("/:id/status", updateStudentStatus)

export default router