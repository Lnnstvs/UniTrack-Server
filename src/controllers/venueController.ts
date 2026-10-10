import { Request, Response } from "express"
import Venue from "../models/Venue"

export const getVenues = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const venues = await Venue.find().sort({ name: 1 })

    res.status(200).json({
      success: true,
      data: venues,
    })
  } catch (error) {
    console.error("Error fetching venues:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch venues.",
    })
  }
}

export const createVenue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      location,
      capacity,
    } = req.body

    if (
      !name ||
      !location ||
      capacity === undefined
    ) {
      res.status(400).json({
        success: false,
        message: "All venue fields are required.",
      })
      return
    }

    const existingVenue = await Venue.findOne({
      name: name.trim(),
    })

    if (existingVenue) {
      res.status(409).json({
        success: false,
        message: "A venue with this name already exists.",
      })
      return
    }

    const venue = await Venue.create({
      name: name.trim(),
      location: location.trim(),
      capacity,
      status: "Available",
    })

    res.status(201).json({
      success: true,
      message: "Venue created successfully.",
      data: venue,
    })
  } catch (error) {
    console.error("Error creating venue:", error)

    res.status(500).json({
      success: false,
      message: "Failed to create venue.",
    })
  }
}

export const updateVenueStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (
      status !== "Available" &&
      status !== "Occupied"
    ) {
      res.status(400).json({
        success: false,
        message: "Status must be Available or Occupied.",
      })
      return
    }

    const venue = await Venue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!venue) {
      res.status(404).json({
        success: false,
        message: "Venue not found.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Venue status updated successfully.",
      data: venue,
    })
  } catch (error) {
    console.error("Error updating venue status:", error)

    res.status(500).json({
      success: false,
      message: "Failed to update venue status.",
    })
  }
}

export const deleteVenue = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    const venue = await Venue.findByIdAndDelete(id)

    if (!venue) {
      res.status(404).json({
        success: false,
        message: "Venue not found.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Venue deleted successfully.",
    })
  } catch (error) {
    console.error("Error deleting venue:", error)

    res.status(500).json({
      success: false,
      message: "Failed to delete venue.",
    })
  }
}