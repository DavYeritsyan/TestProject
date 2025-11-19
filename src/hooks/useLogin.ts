import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { getAuthErrorMessage } from '../constants/authErrors';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await auth().signInWithEmailAndPassword(email, password);
      return { success: true };
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => setError(null);

  return {
    login,
    loading,
    error,
    clearError,
  };
};
