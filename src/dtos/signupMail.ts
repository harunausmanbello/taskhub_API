export default interface SignUpMailInterface {
  _id: string;
  email: string;
}

export interface SignUpMailOptionInterface {
  from: string;
  to: string;
  subject: string;
  html?: string;
}

export interface SignUpVerifyMailInterface{
  [x: string]: any;
  _id: string,
  firstname: string,
  lastname: string,
  isLecturer: boolean,
  matric: string,
  email: string,
  token: string,
  isVerified: boolean,
  password: string,
}

