import mongoose, { Document, Schema } from "mongoose"

export interface IRegistration extends Document {
  studentId: mongoose.Types.ObjectId
  eventId: mongoose.Types.ObjectId
  status: "Pending" | "Confirmed" | "Cancelled"
  registeredAt: Date
}

const registrationSchema = new Schema<IRegistration>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Pending",
    },

    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

registrationSchema.index(
  {
    studentId: 1,
    eventId: 1,
  },
  {
    unique: true,
  }
)

const Registration = mongoose.model<IRegistration>(
  "Registration",
  registrationSchema
)

export default Registration