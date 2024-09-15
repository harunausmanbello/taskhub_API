import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for Course registration document
export interface CourseDocument extends Document {
  title: string;
  code: string;
  cu: number;
}

// Schema for Course registration
const schema: Schema<CourseDocument> = new Schema({
  title: {
    type: String,
    minlength: 3,
    lowercase: true,
    required: true,
  },
  code: {
    type: String,
    minlength: 3,
    lowercase: true,
    required: true,
  },
  cu: {
    type: Number,
    required: true,
  },
});

// Model for Course registration
const Course: Model<CourseDocument> = mongoose.model<CourseDocument>(
  "Courses",
  schema
);

export default Course;
