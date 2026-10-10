import mongoose, { Document, Schema } from "mongoose"

export interface IEvent extends Document {
  title: string
  description: string
  date: Date
  startTime: string
  endTime: string
  venueId: mongoose.Types.ObjectId
  categoryId: mongoose.Types.ObjectId
  capacity: number
  status: "Upcoming" | "Ongoing" | "Completed" | "Cancelled"
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
      trim: true,
    },

    endTime: {
      type: String,
      required: true,
      trim: true,
    },

    venueId: {
      type: Schema.Types.ObjectId,
      ref: "Venue",
      required: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  }
)

const Event = mongoose.model<IEvent>("Event", eventSchema)

export default Event