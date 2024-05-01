export default interface SignIn {
  email: string;
  password: string;
}


export interface SignInUser {
  _id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  isLecturer: boolean;
  matric: string;
  token: string;
  isVerified: boolean;
}
