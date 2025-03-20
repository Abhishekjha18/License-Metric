import { Request } from 'express';
import admin from 'firebase-admin';

/**
 * Extended Request interface with user data
 */
export interface AuthenticatedRequest extends Request {
  user?: admin.auth.DecodedIdToken;
}

/**
 * User profile structure
 */
export interface UserProfile {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified?: boolean;
  createdAt?: string;
  lastSignIn?: string;
  customClaims?: Record<string, any>;
}

/**
 * API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: any;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: PaginationParams;
}