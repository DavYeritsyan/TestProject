import { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { getAuthErrorMessage } from '../constants/authErrors';

export const useRegisteration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const registeration = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      setSuccess(true);
      return { success: true };
    } catch (err: any) {
      const errorMessage = getAuthErrorMessage(err.code);
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => setError(null);
  const resetSuccess = () => setSuccess(false);

  return {
    registeration,
    loading,
    error,
    success,
    clearError,
    resetSuccess,
  };
};
