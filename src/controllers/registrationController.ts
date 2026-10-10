import { Request, Response } from "express"
import Registration from "../models/Registration"
import Student from "../models/Student"
import Event from "../models/Event"

export const getRegistrations = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const registrations = await Registration.find()
      .populate("studentId")
      .populate("eventId")
      .sort({ registeredAt: -1 })

    res.status(200).json({
      success: true,
      data: registrations,
    })
  } catch (error) {
    console.error("Error fetching registrations:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch registrations.",
    })
  }
}

export const createRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { studentId, eventId } = req.body

    if (!studentId || !eventId) {
      res.status(400).json({
        success: false,
        message: "Student and event are required.",
      })
      return
    }

    // Check student
    const student = await Student.findById(studentId)

    if (!student) {
      res.status(404).json({
        success: false,
        message: "Student not found.",
      })
      return
    }

    // Inactive students cannot register
    if (student.status !== "Active") {
      res.status(400).json({
        success: false,
        message: "Inactive students cannot register for events.",
      })
      return
    }

    // Check event
    const event = await Event.findById(eventId)

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found.",
      })
      return
    }

    // Cancelled events cannot receive registrations
    if (event.status === "Cancelled") {
      res.status(400).json({
        success: false,
        message: "Students cannot register for a cancelled event.",
      })
      return
    }

    // Check duplicate registration
    const existingRegistration = await Registration.findOne({
      studentId,
      eventId,
    })

    if (existingRegistration) {
      res.status(409).json({
        success: false,
        message: "This student is already registered for this event.",
      })
      return
    }

    // Check capacity
    const registeredCount = await Registration.countDocuments({
      eventId,
      status: { $ne: "Cancelled" },
    })

    if (registeredCount >= event.capacity) {
      res.status(400).json({
        success: false,
        message: "This event has reached its capacity.",
      })
      return
    }

    const registration = await Registration.create({
      studentId,
      eventId,
      status: "Pending",
    })

    const populatedRegistration = await registration.populate([
      "studentId",
      "eventId",
    ])

    res.status(201).json({
      success: true,
      message: "Registration created successfully.",
      data: populatedRegistration,
    })
  } catch (error) {
    console.error("Error creating registration:", error)

    res.status(500).json({
      success: false,
      message: "Failed to create registration.",
    })
  }
}

export const confirmRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    const registration = await Registration.findById(id)

    if (!registration) {
      res.status(404).json({
        success: false,
        message: "Registration not found.",
      })
      return
    }

    if (registration.status !== "Pending") {
      res.status(400).json({
        success: false,
        message: "Only pending registrations can be confirmed.",
      })
      return
    }

    registration.status = "Confirmed"

    await registration.save()

    const populatedRegistration = await registration.populate([
      "studentId",
      "eventId",
    ])

    res.status(200).json({
      success: true,
      message: "Registration confirmed successfully.",
      data: populatedRegistration,
    })
  } catch (error) {
    console.error("Error confirming registration:", error)

    res.status(500).json({
      success: false,
      message: "Failed to confirm registration.",
    })
  }
}

export const cancelRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    const registration = await Registration.findById(id)

    if (!registration) {
      res.status(404).json({
        success: false,
        message: "Registration not found.",
      })
      return
    }

    registration.status = "Cancelled"

    await registration.save()

    res.status(200).json({
      success: true,
      message: "Registration cancelled successfully.",
      data: registration,
    })
  } catch (error) {
    console.error("Error cancelling registration:", error)

    res.status(500).json({
      success: false,
      message: "Failed to cancel registration.",
    })
  }
}

export const deleteRegistration = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    const registration = await Registration.findByIdAndDelete(id)

    if (!registration) {
      res.status(404).json({
        success: false,
        message: "Registration not found.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Registration deleted successfully.",
    })
  } catch (error) {
    console.error("Error deleting registration:", error)

    res.status(500).json({
      success: false,
      message: "Failed to delete registration.",
    })
  }
}