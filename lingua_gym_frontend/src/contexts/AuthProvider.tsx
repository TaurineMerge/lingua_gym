import { useState, useCallback, useMemo } from 'react';
import { AuthContext } from './AuthContext';
import { initialFormState, initialErrorState, initialTouchedState } from '../utils/auth/Constants';
import { useValidation } from '../hooks/auth/UseAuthValidation';
import { checkUsernameAvailability } from '../services/auth/AuthService';
import { 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword,
  validateDisplayName,
  validateUsername
} from '../utils/auth/AuthValidators';
import { debounce } from '@mui/material';

interface AuthProviderProps {
  children: React.ReactNode;
  initialTab?: number;
}

export const AuthProvider = ({ 
  children,
  initialTab = 0 
}: AuthProviderProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const [touched, setTouched] = useState(initialTouchedState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  const { debouncedValidate } = useValidation();

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setErrors(initialErrorState);
    setTouched(initialTouchedState);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === 'username') {
      setIsUsernameAvailable(null);

      setFormData(prev => ({...prev, username: value, displayName: value}));
      setTouched(prev => ({...prev, username: true, displayName: true}));
    } else {
      setFormData(prev => ({...prev, [name]: value}));
      setTouched(prev => ({...prev, [name]: true}));
    }
    
    debounce(async () => {
      let error = '';
      if (name === 'email') {
        error = validateEmail(value);
      } else if (name === 'password') {
        error = validatePassword(value);
        if (touched.confirmPassword) {
          const confirmError = validateConfirmPassword(formData.confirmPassword, value);
          setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
      } else if (name === 'username') {
        if (value.length < 3) {
          error = 'Username must be at least 3 characters';
        } else {
          error = await validateUsername(value, setIsUsernameAvailable, setIsCheckingUsername, checkUsernameAvailability);
        }
      } else if (name === 'displayName') {
        error = validateDisplayName(value);
      }     
      else if (name === 'confirmPassword') {
        error = validateConfirmPassword(value, formData.password);
      }
  
      setErrors(prev => ({ ...prev, [name]: error }));
    }, 300)();
  }, [formData, touched]);

  const validateForm = useCallback(async () => {
    const newErrors = {
      ...initialErrorState,
      email: validateEmail(formData.email || ''),
      password: validatePassword(formData.password || ''),
      username: activeTab === 1
      ? await validateUsername(formData.username || '', setIsUsernameAvailable, setIsCheckingUsername, checkUsernameAvailability)
      : '',
      displayName: activeTab === 1 ? validateDisplayName(formData.displayName || '') : '',
      confirmPassword: activeTab === 1 ? 
        validateConfirmPassword(formData.confirmPassword || '', formData.password || '') : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  }, [activeTab, formData]);

  const handleSubmit = useCallback(async () => {
    if (!(await validateForm())) return;

    setIsSubmitting(true);
    setErrors(prev => ({...prev, form: ''}));

    try {
      console.log(activeTab === 0 ? 'Sign In' : 'Sign Up', formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      resetForm();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => ({
        ...prev,
        form: activeTab === 0 
          ? `Sign in failed: ${errorMessage}` 
          : `Registration failed: ${errorMessage}`
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [activeTab, formData, validateForm, resetForm]);

  const handleTabChange = useCallback((newValue: number) => {
    if (newValue === activeTab) return;
  
    setIsTabSwitching(true);
    setTimeout(() => {
      setActiveTab(newValue);
      resetForm();
      setIsUsernameAvailable(null);
      setIsTabSwitching(false);
    }, 400); 
  }, [activeTab, resetForm]);

  const handleGoogleLogin = useCallback(() => {
    console.log('Redirecting to Google OAuth');
  }, []);

  const contextValue = useMemo(() => ({
    formData,
    errors,
    touched,
    isSubmitting,
    isUsernameAvailable,
    isCheckingUsername,
    isTabSwitching,
    activeTab,
    handleChange,
    handleSubmit,
    handleTabChange,
    handleGoogleLogin,
    resetForm,
    debouncedValidate,
    setErrors,
    setIsUsernameAvailable,
    setIsCheckingUsername,
  }), [
    formData,
    errors,
    touched,
    isSubmitting,
    isUsernameAvailable,
    isCheckingUsername,
    isTabSwitching,
    activeTab,
    handleChange,
    handleSubmit,
    handleTabChange,
    handleGoogleLogin,
    resetForm,
    debouncedValidate,
    setErrors,
    setIsUsernameAvailable,
    setIsCheckingUsername,
  ]);
  

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};