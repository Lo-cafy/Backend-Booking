import { Request, Response, NextFunction, RequestHandler } from 'express';

// Wrap async route handlers and forward errors to the error middleware
export function asyncHandler(handler: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}




