export default interface SignUp {
  [x: string]: any;
  firstname: string;
  lastname: string;
  matric: string;
  email: string;
  password: string;
  confirm_password?: string;
}

export interface Mail {
  _id: string;
  email: string;
}

export interface MailOptions {
  from: string;
  to: string;
  subject: string;
  html?: string;
}

export interface AccountVerification {
  [x: string]: any;
  _id: string;
  isVerified: boolean;
}
