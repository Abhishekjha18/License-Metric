import admin from 'firebase-admin';

/**
 * Get user data by uid
 */
export const getUserData = async (uid: string) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    
    return {
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      emailVerified: userRecord.emailVerified,
      createdAt: userRecord.metadata.creationTime,
      lastSignIn: userRecord.metadata.lastSignInTime,
      customClaims: userRecord.customClaims
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Update user information
 */
export const updateUser = async (uid: string, data: any) => {
  try {
    await admin.auth().updateUser(uid, data);
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Delete a user account
 */
export const deleteUser = async (uid: string) => {
  try {
    await admin.auth().deleteUser(uid);
    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Get multiple users by their uids
 */
export const getMultipleUsers = async (uids: string[]) => {
  try {
    const result = await admin.auth().getUsers(uids.map(uid => ({ uid })));
    return result.users.map(user => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }));
  } catch (error) {
    throw error;
  }
};