import Joi from "joi";

// Define input schema with password complexity validation
const schema = Joi.object({
  otp: Joi.string().min(6).max(6).trim().required().messages({
    "string.base": "OTP must be a string",
    "string.empty": "OTP cannot be empty",
    "string.min": "OTP must be {#limit} characters long",
    "string.max": "OTP must be {#limit} characters long",
    "any.required": "OTP is required",
  }),
});

export default schema;
