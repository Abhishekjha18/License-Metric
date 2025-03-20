import { body, param, query, ValidationChain } from 'express-validator';

/**
 * Common validation rules for reuse
 */
export const validators = {
  // User related validators
  email: body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  
  displayName: body('displayName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Display name must be between 2 and 50 characters')
    .trim(),
  
  photoURL: body('photoURL')
    .optional()
    .isURL()
    .withMessage('Must be a valid URL'),
  
  // ID validators
  userId: param('userId')
    .isString()
    .withMessage('User ID must be a string'),
  
  // Pagination validators
  page: query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  limit: query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  
  // Custom validators
  customValidator: (field: string): ValidationChain => {
    return body(field)
      .custom((value) => {
        // Add custom validation logic here
        return true;
      })
      .withMessage('Custom validation failed');
  }
};