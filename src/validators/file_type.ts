import path from "path";
import Joi from "joi";

const allowedExtensions = [".txt", ".docx"];

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
