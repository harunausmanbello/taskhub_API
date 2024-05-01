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

