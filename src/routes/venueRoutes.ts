import { Router } from "express"

import {
  getVenues,
  createVenue,
  updateVenueStatus,
  deleteVenue,
} from "../controllers/venueController"

const router = Router()

router.get("/", getVenues)
router.post("/", createVenue)
router.patch("/:id/status", updateVenueStatus)
router.delete("/:id", deleteVenue)

export default router