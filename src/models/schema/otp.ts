import mongoose, { Schema, Document, Model } from "mongoose";

interface OTPDocument extends Document {
  userId: string;
  otp: string;
  status: string;
  createdAt: Date;
}

// OTP schema
const schema: Schema<OTPDocument> = new Schema({
  userId: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    minlength: 6,
    maxlength: 6,
    required: true,
  },

  status: {
    type: String,
    default: "active",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Model for OTP
const OTP: Model<OTPDocument> = mongoose.model<OTPDocument>("otp", schema);

export default OTP;
