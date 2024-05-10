import Joi from "joi";
import validatePassword from "../validators/password_complexity";

// Define input schema with password complexity validation
const schema = Joi.object({

  currentPassword: Joi.string()
    .min(6)
    .max(244)
    .trim()
    .required()
    .messages({
      "string.base": "Current Password must be a string",
      "string.empty": "Current Password cannot be empty",
      "string.min": "Current Password must be at least {#limit} characters long",
      "string.max": "Current Password must be at most {#limit} characters long",
      "any.required": "Current Password is required",
      "any.invalid":
        "Invalid password, Current Password must be contain letters and numbers.",
    })
    .custom((value: string, helpers: Joi.CustomHelpers<string>) => {
      if (!validatePassword(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),
    newPassword: Joi.string()
    .min(6)
    .max(244)
    .trim()
    .required()
    .messages({
      "string.base": "New Password must be a string",
      "string.empty": "New Password cannot be empty",
      "string.min": "New Password must be at least {#limit} characters long",
      "string.max": "New Password must be at most {#limit} characters long",
      "any.required": "New Password is required",
      "any.invalid":
        "Invalid password, New Password must be contain letters and numbers.",
    })
    .custom((value: string, helpers: Joi.CustomHelpers<string>) => {
      if (!validatePassword(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),
    confirmNewPassword: Joi.any().valid(Joi.ref("newPassword")).required().messages({
        "any.only": "Confirm New Passwords do not match",
        "any.required": "Confirm New Password is required",
      }),
});

export default schema;
