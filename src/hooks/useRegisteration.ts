import { useAuthStore } from '../stores/authStore';
import { useNavigation } from '@react-navigation/native';
import { RegistrationScreenNavigationProp } from '../screens/Registration/types';

export const useRegisteration = () => {
  const navigation = useNavigation<RegistrationScreenNavigationProp>();
  const { 
    register, 
    loading, 
    error, 
    success, 
    clearError, 
    resetSuccess 
  } = useAuthStore();

  const onNavigateToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  return {
    registeration: register,
    loading,
    error,
    success,
    clearError,
    resetSuccess,
    onNavigateToLogin,
  };
};
