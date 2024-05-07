import { Request } from "express";

interface AuthRequest extends Request {
  headers: {
    [key: string]: string | string[] | undefined;
  };
  payloadData?: any;
}

export default AuthRequest;
