import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Custom error handler middleware
 */
export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default to 500 (Internal Server Error) if statusCode is not set
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Log the error
  console.error(`[ERROR] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    // Only include the stack trace in development
    ...(isDevelopment && { stack: err.stack }),
    // Only include the error object in development
    ...(isDevelopment && { error: err })
  });
};

/**
 * Custom error class for API errors
 */
export class ApiError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
  
  static badRequest(message: string) {
    return new ApiError(message, 400);
  }
  
  static unauthorized(message: string) {
    return new ApiError(message, 401);
  }
  
  static forbidden(message: string) {
    return new ApiError(message, 403);
  }
  
  static notFound(message: string) {
    return new ApiError(message, 404);
  }
  
  static internal(message: string) {
    return new ApiError(message, 500, false);
  }
}