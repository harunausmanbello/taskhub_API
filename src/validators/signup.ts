import Joi from "joi";
import validatePassword from "../validators/password_complexity";

// Define input schema with password complexity validation
const inputSchema = Joi.object({
  firstname: Joi.string().min(3).trim().lowercase().required(),
  lastname: Joi.string().min(3).trim().lowercase().required(),
  matric: Joi.string().min(11).max(11).trim().lowercase().required(),
  email: Joi.string().min(5).email().trim().lowercase().required(),
  password: Joi.string()
    .min(6)
    .max(244)
    .trim()
    .required()
    .custom((value: string, helpers: Joi.CustomHelpers<string>) => {
      if (!validatePassword(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }),
  confirm_password: Joi.any()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Passwords do not match" }),
});

export default inputSchema;
