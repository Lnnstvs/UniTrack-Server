import { Request, Response } from "express"
import Student from "../models/Student"

export const getStudents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      search,
      status,
      sort = "name",
    } = req.query

    const filter: Record<string, unknown> = {}

    // Filter by student status
    if (status === "Active" || status === "Inactive") {
      filter.status = status
    }

    // Search by name, student ID, email, or course
    if (typeof search === "string" && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i")

      filter.$or = [
        { name: searchRegex },
        { studentId: searchRegex },
        { email: searchRegex },
        { course: searchRegex },
      ]
    }

    // Sorting
    let sortOption: Record<string, 1 | -1> = {
      name: 1,
    }

    if (sort === "name") {
      sortOption = { name: 1 }
    } else if (sort === "name-desc") {
      sortOption = { name: -1 }
    } else if (sort === "newest") {
      sortOption = { createdAt: -1 }
    } else if (sort === "oldest") {
      sortOption = { createdAt: 1 }
    }

    const students = await Student.find(filter).sort(sortOption)

    res.status(200).json({
      success: true,
      data: students,
    })
  } catch (error) {
    console.error("Error fetching students:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch students.",
    })
  }
}

export const createStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      studentId,
      email,
      course,
      yearLevel,
    } = req.body

    if (
      !name ||
      !studentId ||
      !email ||
      !course ||
      yearLevel === undefined
    ) {
      res.status(400).json({
        success: false,
        message: "All student fields are required.",
      })
      return
    }

    const existingStudent = await Student.findOne({
      studentId,
    })

    if (existingStudent) {
      res.status(409).json({
        success: false,
        message: "A student with this student ID already exists.",
      })
      return
    }

    const student = await Student.create({
      name,
      studentId,
      email,
      course,
      yearLevel,
      status: "Active",
    })

    res.status(201).json({
      success: true,
      message: "Student created successfully.",
      data: student,
    })
  } catch (error) {
    console.error("Error creating student:", error)

    res.status(500).json({
      success: false,
      message: "Failed to create student.",
    })
  }
}

export const deleteStudent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    const student = await Student.findByIdAndDelete(id)

    if (!student) {
      res.status(404).json({
        success: false,
        message: "Student not found.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
    })
  } catch (error) {
    console.error("Error deleting student:", error)

    res.status(500).json({
      success: false,
      message: "Failed to delete student.",
    })
  }
}

export const updateStudentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (status !== "Active" && status !== "Inactive") {
      res.status(400).json({
        success: false,
        message: "Status must be Active or Inactive.",
      })
      return
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!student) {
      res.status(404).json({
        success: false,
        message: "Student not found.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Student status updated successfully.",
      data: student,
    })
  } catch (error) {
    console.error("Error updating student status:", error)

    res.status(500).json({
      success: false,
      message: "Failed to update student status.",
    })
  }
}