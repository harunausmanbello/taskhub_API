import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Submits registration document
export interface SubmitsDocument extends Document {
  studentId: string;
  assignmentId: string;
  file: string;
  marks: number;
  status: string;
}

// Schema for Submits registration
const schema: Schema<SubmitsDocument> = new Schema({
  studentId: {
    type: String,
    required: true,
  },
  assignmentId: {
    type: String,
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
    default: 0,
  },
  status: {
    type: String,
    required: true,
    default: "unmarked",
  },
});

// Model for Submits registration
const Submits: Model<SubmitsDocument> =
  mongoose.model<SubmitsDocument>("SubmitAssignment", schema);

export default Submits;
