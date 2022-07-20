import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';

function sendErrorDev(res: Response, err: AppError): void {
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    errStack: err.stack,
  });
}

function globalErrorHandler(
  err: AppError,
  _Req: Request,
  res: Response,
  _next: NextFunction
) {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(res, err);
  }
  // TODO: Add error handling for production
}

export default globalErrorHandler;
