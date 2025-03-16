// express.d.ts
import { FirebaseError } from 'firebase-admin';

declare global {
  namespace Express {
    export interface Request {
      user?: any; // or replace `any` with your user type, for example, FirebaseDecodedToken
    }
  }
}
