import passwordComplexity from "joi-password-complexity";
import PasswordComplexity from "../dtos/password_complexity";
import { ValidationResult } from "joi";

const complexityOptions: PasswordComplexity = {
  min: 6,
  max: 244,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 2,
};

const validatePassword = (password: string): boolean => {
  const result: ValidationResult<string> = passwordComplexity(
    complexityOptions,
    "Password"
  ).validate(password);
  return !result.error ? true : false;
};
export default validatePassword;
