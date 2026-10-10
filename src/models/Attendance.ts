import mongoose, { Document, Schema } from "mongoose"

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId
  eventId: mongoose.Types.ObjectId
  registrationId: mongoose.Types.ObjectId
  status: "Present" | "Absent"
  markedAt: Date
}

const attendanceSchema = new Schema<IAttendance>(
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

    registrationId: {
      type: Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      unique: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Present",
    },

    markedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

const Attendance = mongoose.model<IAttendance>(
  "Attendance",
  attendanceSchema
)

export default Attendance