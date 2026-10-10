import { Request, Response } from "express"

import Attendance from "../models/Attendance"
import Registration from "../models/Registration"
import Student from "../models/Student"
import Event from "../models/Event"

export const getAttendance = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const attendance = await Attendance.find()
      .populate("studentId")
      .populate("eventId")
      .populate("registrationId")
      .sort({ markedAt: -1 })

    res.status(200).json({
      success: true,
      data: attendance,
    })
  } catch (error) {
    console.error("Error fetching attendance:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance.",
    })
  }
}

export const markAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { registrationId, status } = req.body

    if (!registrationId || !status) {
      res.status(400).json({
        success: false,
        message: "Registration and attendance status are required.",
      })
      return
    }

    if (status !== "Present" && status !== "Absent") {
      res.status(400).json({
        success: false,
        message: "Status must be Present or Absent.",
      })
      return
    }

    // Find registration
    const registration = await Registration.findById(
      registrationId
    )

    if (!registration) {
      res.status(404).json({
        success: false,
        message: "Registration not found.",
      })
      return
    }

    // Only confirmed registrations can have attendance
    if (registration.status !== "Confirmed") {
      res.status(400).json({
        success: false,
        message:
          "Only confirmed registrations can be marked for attendance.",
      })
      return
    }

    // Check student
    const student = await Student.findById(
      registration.studentId
    )

    if (!student) {
      res.status(404).json({
        success: false,
        message: "Student not found.",
      })
      return
    }

    // Check event
    const event = await Event.findById(
      registration.eventId
    )

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found.",
      })
      return
    }

    // Prevent duplicate attendance records
    const existingAttendance = await Attendance.findOne({
      registrationId,
    })

    if (existingAttendance) {
      res.status(409).json({
        success: false,
        message: "Attendance has already been recorded.",
      })
      return
    }

    const attendance = await Attendance.create({
      studentId: registration.studentId,
      eventId: registration.eventId,
      registrationId,
      status,
    })

    const populatedAttendance = await attendance.populate([
      "studentId",
      "eventId",
      "registrationId",
    ])

    res.status(201).json({
      success: true,
      message: "Attendance recorded successfully.",
      data: populatedAttendance,
    })
  } catch (error) {
    console.error("Error marking attendance:", error)

    res.status(500).json({
      success: false,
      message: "Failed to record attendance.",
    })
  }
}

export const updateAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (status !== "Present" && status !== "Absent") {
      res.status(400).json({
        success: false,
        message: "Status must be Present or Absent.",
      })
      return
    }

    const attendance = await Attendance.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("studentId")
      .populate("eventId")
      .populate("registrationId")

    if (!attendance) {
      res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Attendance updated successfully.",
      data: attendance,
    })
  } catch (error) {
    console.error("Error updating attendance:", error)

    res.status(500).json({
      success: false,
      message: "Failed to update attendance.",
    })
  }
}

export const deleteAttendance = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    const attendance = await Attendance.findByIdAndDelete(id)

    if (!attendance) {
      res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully.",
    })
  } catch (error) {
    console.error("Error deleting attendance:", error)

    res.status(500).json({
      success: false,
      message: "Failed to delete attendance record.",
    })
  }
}