import { Request, Response } from "express"

import Student from "../models/Student"
import Event from "../models/Event"
import Registration from "../models/Registration"
import Attendance from "../models/Attendance"
import Venue from "../models/Venue"
import Category from "../models/Category"

export const getDashboardStats = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const [
      totalStudents,
      activeStudents,
      totalEvents,
      upcomingEvents,
      totalRegistrations,
      confirmedRegistrations,
      totalAttendance,
      availableVenues,
      totalCategories,
    ] = await Promise.all([
      Student.countDocuments(),

      Student.countDocuments({
        status: "Active",
      }),

      Event.countDocuments(),

      Event.countDocuments({
        status: "Upcoming",
      }),

      Registration.countDocuments(),

      Registration.countDocuments({
        status: "Confirmed",
      }),

      Attendance.countDocuments(),

      Venue.countDocuments({
        status: "Available",
      }),

      Category.countDocuments(),
    ])

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        totalEvents,
        upcomingEvents,
        totalRegistrations,
        confirmedRegistrations,
        totalAttendance,
        availableVenues,
        totalCategories,
      },
    })
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics.",
    })
  }
}