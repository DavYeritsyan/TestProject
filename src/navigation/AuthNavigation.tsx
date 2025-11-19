import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import RegistrationScreen from '../screens/Registration';

export type AuthStackParamList = {
    LoginScreen: undefined;
    RegistrationScreen: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigation = () => {
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
            <AuthStack.Screen name="RegistrationScreen" component={RegistrationScreen} />
        </AuthStack.Navigator>
    );
};

export default AuthNavigation;