export default interface Otp {
  [x: string]: any;
  userId: string;
  otp: string;
  status: string;
  createdAt: Date
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

export interface savedOtp {
  _id: string;
  user_id: string;
}
