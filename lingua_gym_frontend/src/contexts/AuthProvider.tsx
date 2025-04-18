import { useState, useCallback, useMemo, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { initialFormState, initialErrorState, initialTouchedState } from '../utils/auth/Constants';
import { useValidation } from '../hooks/auth/UseAuthValidation';
import { 
  validateEmail, 
  validatePassword, 
  validateConfirmPassword,
  validateDisplayName,
  validateLocalUsername
} from '../utils/auth/AuthValidators';
import { useAvailabilityCheck } from '../hooks/api/UseAvailabilityCheck';

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
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  const { debouncedValidate } = useValidation({
    formData,
    touched,
    setErrors
  });

  const {
    isAvailable: isUsernameAvailable,
    isChecking: isCheckingUsername,
  } = useAvailabilityCheck(formData.username, 'http://localhost:3000/api/access_management/check-username-exists', 'username');

  const {
    isAvailable: isEmailAvailable,
    isChecking: isCheckingEmail,
  } = useAvailabilityCheck(formData.email, 'http://localhost:3000/api/access_management/check-email-exists', 'email');

  useEffect(() => {
    const isOnSignup = activeTab === 1;
    const isValidEmail = validateEmail(formData.email || '');
  
    if (!isValidEmail || isEmailAvailable === null) return;
  
    if (isEmailAvailable === false && isOnSignup) {
      setErrors(prev => ({
        ...prev,
        email: '',
      }));
    } else if (isEmailAvailable === true && !isOnSignup) {
      setErrors(prev => ({
        ...prev,
        email: '',
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        email: '',
      }));
    }
  }, [isEmailAvailable, formData.email, activeTab]);

  useEffect(() => {
    const isOnSignup = activeTab === 1;
    const isValidLocally = !validateLocalUsername(formData.username || '');
  
    if (!isOnSignup || !isValidLocally || isUsernameAvailable === null) return;
  
    if (isUsernameAvailable) {
      setErrors(prev => ({
        ...prev,
        username: '',
      }));
    } else {
      setErrors(prev => ({
        ...prev,
        username: '',
      }));
    }
  }, [isUsernameAvailable, formData.username, activeTab]);

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setErrors(initialErrorState);
    setTouched(initialTouchedState);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    const fieldName = name as keyof typeof formData;
    const isUsernameField = fieldName === 'username';
  
    if (isUsernameField) {
      setFormData(prev => ({ ...prev, username: value, displayName: value }));
      setTouched(prev => ({ ...prev, username: true, displayName: true }));
    } else {
      setFormData(prev => ({ ...prev, [fieldName]: value }));
      setTouched(prev => ({ ...prev, [fieldName]: true }));
    }
  
    if (fieldName === 'username') {
      const usernameError = validateLocalUsername(value);
      setErrors(prev => ({ ...prev, username: usernameError }));
    } else {
      debouncedValidate(fieldName, value);
    }
  
  }, [debouncedValidate]);
  

  const validateForm = useCallback(() => {
    const newErrors = {
      ...initialErrorState,
      email: validateEmail(formData.email || ''),
      password: validatePassword(formData.password || ''),
      username: activeTab === 1
        ? validateLocalUsername(formData.username || '')
        : '',
      displayName: activeTab === 1 ? validateDisplayName(formData.displayName || '') : '',
      confirmPassword: activeTab === 1
        ? validateConfirmPassword(formData.confirmPassword || '', formData.password || '')
        : ''
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  }, [activeTab, formData]);

  const handleSubmit = useCallback(async () => {
    if (!(validateForm())) return;

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, form: '' }));

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
    isTabSwitching,
    activeTab,
    handleChange,
    handleSubmit,
    handleTabChange,
    handleGoogleLogin,
    resetForm,
    debouncedValidate,
    setErrors,
    isUsernameAvailable,
    isCheckingUsername,
    isEmailAvailable,
    isCheckingEmail
  }), [
    formData,
    errors,
    touched,
    isSubmitting,
    isTabSwitching,
    activeTab,
    handleChange,
    handleSubmit,
    handleTabChange,
    handleGoogleLogin,
    resetForm,
    debouncedValidate,
    setErrors,
    isUsernameAvailable,
    isCheckingUsername,
    isEmailAvailable,
    isCheckingEmail
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
