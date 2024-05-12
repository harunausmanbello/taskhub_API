import path from "path";
import Joi from "joi";

// Function to validate file extension
const allowedExtensions = [".pdf", ".docx"];

// Function to validate file extension
export default function validateFileExtension(
  file: Express.Multer.File,
  helpers: Joi.CustomHelpers<string>
) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return helpers.error("any.invalid");
  }
  return file;
}
