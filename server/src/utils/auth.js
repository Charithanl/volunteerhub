import { getAuth } from '@clerk/express';

export const getClerkUserId = (request) => {
  const auth = getAuth(request);

  if (!auth?.userId) {
    const error = new Error('Authentication required.');
    error.statusCode = 401;
    throw error;
  }

  return auth.userId;
};
