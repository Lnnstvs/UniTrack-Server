import mongoose, { Document, Schema } from "mongoose"

export interface IVenue extends Document {
  name: string
  location: string
  capacity: number
  status: "Available" | "Occupied"
}

const venueSchema = new Schema<IVenue>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["Available", "Occupied"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
)

const Venue = mongoose.model<IVenue>("Venue", venueSchema)

export default Venue