import { useMemo } from 'react';
import { debounce } from 'lodash';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateDisplayName,
  validateLocalUsername,
} from '../../utils/auth/AuthValidators';
import { TouchedFields, AuthErrors } from '../../types/AuthTypes';

type FieldName = 'email' | 'password' | 'username' | 'confirmPassword' | 'displayName';

interface UseValidationParams {
  formData: {
    email: string;
    password: string;
    username: string;
    confirmPassword: string;
    displayName: string;
  };
  touched: TouchedFields;
  setErrors: React.Dispatch<React.SetStateAction<AuthErrors>>;
}


export const useValidation = ({
  formData,
  touched,
  setErrors,
}: UseValidationParams) => {
  const validateField = useMemo(() => {
    return (name: FieldName, value: string) => {
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
          error = validateLocalUsername(value);
          break;

        case 'displayName':
          error = validateDisplayName(value);
          break;

        case 'confirmPassword':
          error = validateConfirmPassword(value, formData.password);
          break;
      }

      setErrors(prev => ({ ...prev, [name]: error }));
    };
  }, [formData, touched, setErrors]);

  const debouncedValidate = useMemo(() => debounce(validateField, 300), [validateField]);

  return { debouncedValidate };
};
