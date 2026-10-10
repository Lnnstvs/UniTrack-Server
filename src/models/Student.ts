import mongoose, { Document, Schema } from "mongoose"

export interface IStudent extends Document {
  name: string
  studentId: string
  email: string
  course: string
  yearLevel: number
  status: "Active" | "Inactive"
}

const studentSchema = new Schema<IStudent>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    course: {
      type: String,
      required: true,
      trim: true,
    },

    yearLevel: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
)

const Student = mongoose.model<IStudent>("Student", studentSchema)

export default Student