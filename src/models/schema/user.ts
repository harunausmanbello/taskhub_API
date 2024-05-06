import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for user registration document
export interface UserDocument extends Document {
  firstname: string;
  lastname: string;
  isLecturer: boolean;
  matric: string;
  email: string;
  token: string | null;
  isVerified: boolean;
  password: string;
}

// Schema for user registration
const schema: Schema<UserDocument> = new Schema({
  firstname: {
    type: String,
    minlength: 3,
    lowercase: true,
    required: true,
  },
  lastname: {
    type: String,
    minlength: 3,
    lowercase: true,
    required: true,
  },
  isLecturer: {
    type: Boolean,
    default: false,
  },
  matric: {
    type: String,
    minlength: 11,
    maxlength: 11,
    lowercase: true,
    unique: true,
    required: function (this: UserDocument) {
      return !this.isLecturer;
    },
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    lowercase: true,
    unique: true,
  },
  token: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 244,
    required: true,
  },
});

// Model for user registration
const User: Model<UserDocument> = mongoose.model<UserDocument>("users", schema);

export default User;
