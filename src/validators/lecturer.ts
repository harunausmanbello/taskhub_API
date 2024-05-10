import Joi from "joi";
import validatePassword from "./password_complexity";

// Define input schema with password complexity validation
const changePassword = Joi.object({
  currentPassword: Joi.string()
    .min(6)
    .max(244)
    .trim()
    .required()
    .messages({
      "string.base": "Current Password must be a string",
      "string.empty": "Current Password cannot be empty",
      "string.min":
        "Current Password must be at least {#limit} characters long",
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
  confirmNewPassword: Joi.any()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirm New Passwords do not match",
      "any.required": "Confirm New Password is required",
    }),
});

const updateProfile = Joi.object({
  firstname: Joi.string().min(3).trim().lowercase().required().messages({
    "string.base": "First name must be a string",
    "string.empty": "First name cannot be empty",
    "string.min": "First name must be at least {#limit} characters long",
    "any.required": "First name is required",
  }),
  lastname: Joi.string().min(3).trim().lowercase().required().messages({
    "string.base": "Last name must be a string",
    "string.empty": "Last name cannot be empty",
    "string.min": "Last name must be at least {#limit} characters long",
    "any.required": "Last name is required",
  }),
  email: Joi.string().min(5).email().trim().lowercase().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email cannot be empty",
    "string.min": "Email must be at least {#limit} characters long",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
});

const addUser = Joi.object({
  firstname: Joi.string().min(3).trim().lowercase().required().messages({
    "string.base": "First name must be a string",
    "string.empty": "First name cannot be empty",
    "string.min": "First name must be at least {#limit} characters long",
    "any.required": "First name is required",
  }),
  lastname: Joi.string().min(3).trim().lowercase().required().messages({
    "string.base": "Last name must be a string",
    "string.empty": "Last name cannot be empty",
    "string.min": "Last name must be at least {#limit} characters long",
    "any.required": "Last name is required",
  }),
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
      "any.invalid": "Password not validated",
    })
    .custom((value: string, helpers: Joi.CustomHelpers<string>) => {
      if (!validatePassword(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),
    isLecturer: Joi.boolean().required().messages({
      "boolean.base": "Lecturer must be a boolean",
      "boolean.empty": "Lecturer cannot be empty",
      "any.required": "Lecturer is required",
    })
});

export { changePassword, updateProfile, addUser };
