import { Request, Response } from "express"

import Student from "../models/Student"
import Event from "../models/Event"
import Registration from "../models/Registration"
import Attendance from "../models/Attendance"

export const getStatistics = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      studentsByStatus,
      eventsByStatus,
      registrationsByStatus,
      attendanceByStatus,
    ] = await Promise.all([
      Student.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      Event.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      Registration.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      Attendance.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ])

    res.status(200).json({
      success: true,
      data: {
        studentsByStatus,
        eventsByStatus,
        registrationsByStatus,
        attendanceByStatus,
      },
    })
  } catch (error) {
    console.error("Error fetching statistics:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics.",
    })
  }
}