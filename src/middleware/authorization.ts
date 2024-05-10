import { Request, Response, NextFunction } from "express";

// Middleware function to authorize access for students
export const studentAuthMiddleware = (req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>> => {
  const isStudent: boolean = (req.user as { isLecturer: boolean }).isLecturer === false;
  if (!isStudent) {
    return res.status(403).json({ code: 403, message: 'Access denied' });
  }
  next();
};

// Middleware function to authorize access for lecturers
export const lecturerAuthMiddleware = (req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>> => {
  const isLecturer: boolean = (req.user as { isLecturer: boolean }).isLecturer === true;
  if (!isLecturer) {
    return res.status(403).json({ code: 403, message: 'Access denied.' });
  }
  next();
};
