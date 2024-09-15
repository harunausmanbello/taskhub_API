import Joi from "joi";
import validatePassword from "../validators/password_complexity";

// Define input schema with password complexity validation
const schema = Joi.object({
  email: Joi.string().min(5).email().trim().lowercase().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email cannot be empty",
    "string.min": "Email must be at least {#limit} characters long",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .min(6)
    .max(244)
    .trim()
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password cannot be empty",
      "string.min": "Password must be at least {#limit} characters long",
      "string.max": "Password must be at most {#limit} characters long",
      "any.required": "Password is required",
      "any.invalid":
        "Invalid password, Password must be contain letters and numbers.",
    })
    .custom((value: string, helpers: Joi.CustomHelpers<string>) => {
      if (!validatePassword(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),
});

export default schema;
