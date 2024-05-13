import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Assignment registration document
export interface AssignmentDocument extends Document {
  courseId: string;
  name: string;
  description: string;
  from: Date;
  to: Date;
  status: string;
}

// Schema for Assignment registration
const schema: Schema<AssignmentDocument> = new Schema({
  courseId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    minlength: 3,
    lowercase: true,
    required: true,
  },
  description: {
    type: String,
    minlength: 3,
    lowercase: true,
    required: true,
  },
  from: {
    type: Date,
    required: true,
  },
  to: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "active",
  },
});

// Model for Assignment registration
const Assignment: Model<AssignmentDocument> =
  mongoose.model<AssignmentDocument>("Assignments", schema);

export default Assignment;
