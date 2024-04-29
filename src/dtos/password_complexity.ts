export default interface PasswordComplexity {
  min: number;
  max: number;
  lowerCase: number;
  upperCase: number;
  numeric: number;
  symbol: number;
  requirementCount: number;
}
