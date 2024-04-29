import { Request } from "express";

interface AuthRequest extends Request {
    headers: {
        [key: string]: string | string[] | undefined; // Allow undefined values
    };
    payloadData?: any; // Define the payloadData property
}

export default AuthRequest;
