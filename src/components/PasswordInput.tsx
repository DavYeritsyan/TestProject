import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChangeText,
  onBlur,
  placeholder,
  error,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          style={[
            styles.input,
            styles.passwordInput,
            error && styles.inputError,
          ]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          onBlur={onBlur}
          secureTextEntry={!showPassword}
          editable={!disabled}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.eyeText}>
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.errorText}>{error || null}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    color: '#000',
  },
  passwordInput: {
    paddingRight: 50,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  eyeText: {
    fontSize: 20,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginTop: 4,
    minHeight: 16,
  },
});
