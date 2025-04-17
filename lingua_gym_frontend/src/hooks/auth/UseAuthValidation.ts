import { useCallback } from 'react';
import { debounce } from 'lodash';
import { useAuth } from './UseAuthForm';
import { 
  validateEmail, 
  validatePassword, 
  validateUsername,
  validateConfirmPassword,
  validateDisplayName
} from '../../utils/auth/AuthValidators';
import { checkUsernameAvailability } from '../../services/auth/AuthService';

export const useValidation = () => {
  const { 
    formData = { email: '', password: '', username: '', confirmPassword: '' }, 
    touched = { email: false, password: false, username: false, confirmPassword: false }, 
    setErrors,
    setIsUsernameAvailable,
    setIsCheckingUsername
  } = useAuth();

  const debouncedValidate = useCallback(
    debounce(async (name: string, value: string, password: string) => {
      let error = '';

      switch (name) {
        case 'email':
          error = validateEmail(value);
          break;
        case 'password':
          error = validatePassword(value);
          if (touched.confirmPassword) {
            const confirmError = validateConfirmPassword(formData.confirmPassword, value);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
          }
          break;
        case 'username':
          error = await validateUsername(
            value,
            setIsUsernameAvailable,
            setIsCheckingUsername,
            checkUsernameAvailability
          );
          break;
        case 'displayName':
          error = validateDisplayName(value);
          break;
        case 'confirmPassword':
          error = validateConfirmPassword(value, password);
          break;
      }

      setErrors(prev => ({ ...prev, [name]: error }));
    }, 300),
    [
      formData?.confirmPassword, 
      touched?.confirmPassword, 
      setErrors, 
      setIsUsernameAvailable, 
      setIsCheckingUsername
    ]
  );

  return { debouncedValidate };
};
