
import { Router } from "express"

import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  updateEventStatus,
  deleteEvent,
} from "../controllers/eventController"

const router = Router()

router.get("/", getEvents)
router.get("/:id", getEventById)
router.post("/", createEvent)
router.patch("/:id/status", updateEventStatus)
router.patch("/:id", updateEvent)
router.delete("/:id", deleteEvent)

export default router