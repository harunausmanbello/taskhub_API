import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for CourseEnroll registration document
export interface CourseEnrollDocument extends Document {
  studentId: string;
  courseId: string;
  createdAt: Date;
}

// Schema for CourseEnroll registration
const schema: Schema<CourseEnrollDocument> = new Schema({
  studentId: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

// Model for CourseEnroll registration
const CourseEnroll: Model<CourseEnrollDocument> =
  mongoose.model<CourseEnrollDocument>("CourseEnrollment", schema);

export default CourseEnroll;
