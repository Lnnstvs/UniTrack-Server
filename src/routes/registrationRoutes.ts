import { Router } from "express"

import {
  getRegistrations,
  createRegistration,
  confirmRegistration,
  cancelRegistration,
  deleteRegistration,
} from "../controllers/registrationController"

const router = Router()

router.get("/", getRegistrations)

router.post("/", createRegistration)

router.patch("/:id/confirm", confirmRegistration)

router.patch("/:id/cancel", cancelRegistration)

router.delete("/:id", deleteRegistration)

export default router