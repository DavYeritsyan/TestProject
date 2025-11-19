export enum FirebaseAuthErrorCode {
  INVALID_EMAIL = 'auth/invalid-email',
  USER_NOT_FOUND = 'auth/user-not-found',
  WRONG_PASSWORD = 'auth/wrong-password',
  INVALID_CREDENTIAL = 'auth/invalid-credential',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
  EMAIL_ALREADY_IN_USE = 'auth/email-already-in-use',
  WEAK_PASSWORD = 'auth/weak-password',
  NETWORK_REQUEST_FAILED = 'auth/network-request-failed',
}

export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case FirebaseAuthErrorCode.INVALID_EMAIL:
      return 'Invalid email address';
    case FirebaseAuthErrorCode.USER_NOT_FOUND:
      return 'No user found with this email';
    case FirebaseAuthErrorCode.WRONG_PASSWORD:
      return 'Incorrect password';
    case FirebaseAuthErrorCode.INVALID_CREDENTIAL:
      return 'Invalid credentials. Please check your email and password';
    case FirebaseAuthErrorCode.TOO_MANY_REQUESTS:
      return 'Too many failed attempts. Please try again later';
    case FirebaseAuthErrorCode.EMAIL_ALREADY_IN_USE:
      return 'This email is already registered';
    case FirebaseAuthErrorCode.WEAK_PASSWORD:
      return 'Password is too weak';
    case FirebaseAuthErrorCode.NETWORK_REQUEST_FAILED:
      return 'Network error. Please check your connection';
    default:
      return 'An unexpected error occurred. Please try again';
  }
};
