import Joi from "joi";
import validatePassword from "../validators/password_complexity";

// Define input schema with password complexity validation
const inputSchema = Joi.object({
  email: Joi.string().min(5).email().trim().lowercase().required(),
  password: Joi.string().min(6).max(244).trim().required().custom((value: string, helpers: Joi.CustomHelpers<string>) => {
    if (!validatePassword(value)) {
      return helpers.error('any.invalid');
    }
    return value;
  })
});

export default inputSchema;
