import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../../application';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
  };

  console.error('[INTERNAL ERROR]', err);

  return res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
  });
};