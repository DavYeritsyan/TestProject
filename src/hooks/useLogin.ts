import { LoginScreenNavigationProp } from '../screens/Login/types';
import { useAuthStore } from '../stores/authStore';
import { useNavigation } from '@react-navigation/native';

export const useLogin = () => {
  const { login, loading, error, clearError } = useAuthStore();
  const navigation = useNavigation<LoginScreenNavigationProp>();
 const onNavigateToSignUp = () => {
    navigation.navigate('RegistrationScreen');
  };
  return {
    login,
    loading,
    error,
    clearError,
    onNavigateToSignUp,
  };
};
