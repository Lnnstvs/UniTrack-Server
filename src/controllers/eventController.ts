import { Request, Response } from "express"
import Event from "../models/Event"
import Registration from "../models/Registration"

import Venue from "../models/Venue"
import Category from "../models/Category"




export const getEventById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("venueId")
      .populate("categoryId")

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found.",
      })
      return
    }

    const registeredCount = await Registration.countDocuments({
      eventId: event._id,
      status: { $ne: "Cancelled" },
    })

    res.status(200).json({
      success: true,
      data: {
        ...event.toObject(),
        registeredCount,
        availableSlots: Math.max(
          event.capacity - registeredCount,
          0
        ),
      },
    })
  } catch (error) {
    console.error("Error fetching event:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch event.",
    })
  }
}

export const updateEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      venueId,
      categoryId,
      capacity,
    } = req.body

    if (
      !title?.trim() ||
      !description?.trim() ||
      !date ||
      !startTime ||
      !endTime ||
      !venueId ||
      !categoryId ||
      capacity === undefined ||
      !Number.isInteger(Number(capacity)) ||
      Number(capacity) < 1
    ) {
      res.status(400).json({
        success: false,
        message: "Please provide valid values for all event fields.",
      })
      return
    }

    if (startTime >= endTime) {
      res.status(400).json({
        success: false,
        message: "End time must be later than start time.",
      })
      return
    }

    const [venue, category] = await Promise.all([
      Venue.findById(venueId),
      Category.findById(categoryId),
    ])

    if (!venue || !category) {
      res.status(400).json({
        success: false,
        message: "Please select an existing venue and category.",
      })
      return
    }

    const existingEvent = await Event.findById(req.params.id)

    if (!existingEvent) {
      res.status(404).json({
        success: false,
        message: "Event not found.",
      })
      return
    }

    const registeredCount = await Registration.countDocuments({
      eventId: existingEvent._id,
      status: { $ne: "Cancelled" },
    })

    if (Number(capacity) < registeredCount) {
      res.status(400).json({
        success: false,
        message: `Capacity cannot be lower than the current ${registeredCount} registrations.`,
      })
      return
    }

    existingEvent.title = title.trim()
    existingEvent.description = description.trim()
    existingEvent.date = new Date(date)
    existingEvent.startTime = startTime
    existingEvent.endTime = endTime
    existingEvent.venueId = venue._id
    existingEvent.categoryId = category._id
    existingEvent.capacity = Number(capacity)

    await existingEvent.save()
    await existingEvent.populate(["venueId", "categoryId"])

    res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      data: {
        ...existingEvent.toObject(),
        registeredCount,
        availableSlots: Math.max(
          existingEvent.capacity - registeredCount,
          0
        ),
      },
    })
  } catch (error) {
    console.error("Error updating event:", error)

    res.status(500).json({
      success: false,
      message: "Failed to update event.",
    })
  }
}




export const getEvents = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      search,
      status,
      categoryId,
      venueId,
      sort = "date",
    } = req.query

    const filter: Record<string, unknown> = {}

    // Search event title or description
    if (typeof search === "string" && search.trim()) {
      const searchRegex = new RegExp(search.trim(), "i")

      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
      ]
    }

    // Filter by event status
    if (
      status === "Upcoming" ||
      status === "Ongoing" ||
      status === "Completed" ||
      status === "Cancelled"
    ) {
      filter.status = status
    }

    // Filter by category
    if (typeof categoryId === "string" && categoryId.trim()) {
      filter.categoryId = categoryId
    }

    // Filter by venue
    if (typeof venueId === "string" && venueId.trim()) {
      filter.venueId = venueId
    }

    // Sorting
    let sortOption: Record<string, 1 | -1> = {
      date: 1,
    }

    if (sort === "date") {
      sortOption = {
        date: 1,
      }
    } else if (sort === "date-desc") {
      sortOption = {
        date: -1,
      }
    } else if (sort === "title") {
      sortOption = {
        title: 1,
      }
    } else if (sort === "title-desc") {
      sortOption = {
        title: -1,
      }
    } else if (sort === "newest") {
      sortOption = {
        createdAt: -1,
      }
    }

    const events = await Event.find(filter)
      .populate("venueId")
      .populate("categoryId")
      .sort(sortOption)

    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const registeredCount = await Registration.countDocuments({
          eventId: event._id,
          status: { $ne: "Cancelled" },
        })

        const availableSlots = Math.max(
          event.capacity - registeredCount,
          0
        )

        return {
          ...event.toObject(),
          registeredCount,
          availableSlots,
        }
      })
    )

    res.status(200).json({
      success: true,
      data: eventsWithCounts,
    })
  } catch (error) {
    console.error("Error fetching events:", error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch events.",
    })
  }
}




export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      title,
      description,
      date,
      startTime,
      endTime,
      venueId,
      categoryId,
      capacity,
    } = req.body

    if (
      !title ||
      !description ||
      !date ||
      !startTime ||
      !endTime ||
      !venueId ||
      !categoryId ||
      capacity === undefined
    ) {
      res.status(400).json({
        success: false,
        message: "All event fields are required.",
      })
      return
    }

    const event = await Event.create({
      title,
      description,
      date,
      startTime,
      endTime,
      venueId,
      categoryId,
      capacity,
      status: "Upcoming",
    })

    res.status(201).json({
      success: true,
      message: "Event created successfully.",
      data: event,
    })
  } catch (error) {
    console.error("Error creating event:", error)

    res.status(500).json({
      success: false,
      message: "Failed to create event.",
    })
  }
}

export const updateEventStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { status } = req.body

    const validStatuses = [
      "Upcoming",
      "Ongoing",
      "Completed",
      "Cancelled",
    ]

    if (!validStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid event status.",
      })
      return
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found.",
      })
      return
    }

    res.status(200).json({
      success: true,
      message: "Event status updated successfully.",
      data: event,
    })
  } catch (error) {
    console.error("Error updating event status:", error)

    res.status(500).json({
      success: false,
      message: "Failed to update event status.",
    })
  }
}

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params

    const event = await Event.findByIdAndDelete(id)

    if (!event) {
      res.status(404).json({
        success: false,
        message: "Event not found.",
      })
      return
    }

    await Registration.deleteMany({
      eventId: id,
    })

    res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    })
  } catch (error) {
    console.error("Error deleting event:", error)

    res.status(500).json({
      success: false,
      message: "Failed to delete event.",
    })
  }
}