import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for user registration document
interface UserSignUpDocument extends Document {
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
const signupSchema: Schema<UserSignUpDocument> = new Schema({
  firstname: {
    type: String,
    minlength: [3, "firstname must be at least 3 characters long"],
    lowercase: true,
    required: [true, "firstname is required"],
  },
  lastname: {
    type: String,
    minlength: [3, "lastname must be at least 3 characters long"],
    lowercase: true,
    required: [true, "lastname is required"],
  },
  isLecturer: {
    type: Boolean,
    default: false, 
  },
  matric: {
    type: String,
    minlength: [11, "Matric must be 11 characters long"],
    maxlength: [11, "Matric must be 11 characters long"],
    lowercase: true,
    unique: true, 
    required: function (this: UserSignUpDocument) {
      return !this.isLecturer;
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    minlength: [5, "Email must be at least 5 characters long"],
    lowercase: true,
    unique: true, 
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
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
    minlength: [6, "Password must be at least 6 characters long"],
    maxlength: [244, "Password cannot exceed 244 characters"],
    required: [true, "Password is required"],
  },
});

// Model for user registration
const UserSignUp: Model<UserSignUpDocument> =
  mongoose.model<UserSignUpDocument>("users", signupSchema);

export default UserSignUp;
