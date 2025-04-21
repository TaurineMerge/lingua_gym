import { useState, useCallback, useMemo, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { initialFormState, initialErrorState, initialTouchedState } from '../utils/auth/Constants';
import { useValidation } from '../hooks/auth/UseAuthValidation';
import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateDisplayName,
  validateLocalUsername,
} from '../utils/auth/AuthValidators';
import { useAvailabilityCheck } from '../hooks/api/UseAvailabilityCheck';
import { useAuthRequest, AuthResponse, RegisterData, LoginData } from '../hooks/api/UseAuthRequest';

interface AuthProviderProps {
  children: React.ReactNode;
  initialTab?: number;
  onAuthSuccess?: () => void;
}

export const AuthProvider = ({
  children,
  initialTab = 0,
  onAuthSuccess,
}: AuthProviderProps) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState(initialErrorState);
  const [touched, setTouched] = useState(initialTouchedState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTabSwitching, setIsTabSwitching] = useState(false);

  const { request: register, loading: isRegistering, error: registrationError } = useAuthRequest<RegisterData, AuthResponse>('http://localhost:3000/api/access_management/register', 'post');
  const { request: login, loading: isLoggingIn, error: loginError } = useAuthRequest<LoginData, AuthResponse>('http://localhost:3000/api/access_management/login', 'post');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const { debouncedValidate } = useValidation({ formData, touched, setErrors });

  const {
    isAvailable: isUsernameAvailable,
    isChecking: isCheckingUsername,
  } = useAvailabilityCheck(formData.username, 'http://localhost:3000/api/access_management/check-username-exists', 'username');

  const {
    isAvailable: isEmailAvailable,
    isChecking: isCheckingEmail,
  } = useAvailabilityCheck(formData.email, 'http://localhost:3000/api/access_management/check-email-exists', 'email');

  useEffect(() => {
    if (loginError) {
      setErrors(prev => ({
        ...prev,
        form: `Login failed: ${loginError.message}`
      }));
    }
  }, [loginError]);

  // current auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/access_management/is-authenticated', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'cors',
        });
  
        if (!response.ok) throw new Error('Not authenticated');
  
        const data = await response.json();
        setIsAuthenticated(data.authenticated);
      } catch (err) {
        try {
          const refreshResponse = await fetch('http://localhost:3000/api/access_management/refresh-token', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'cors',
          });
  
          if (!refreshResponse.ok) throw new Error('Refresh failed');
          
          const retryResponse = await fetch('http://localhost:3000/api/access_management/is-authenticated', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            mode: 'cors',
          });
  
          const retryData = await retryResponse.json();
          setIsAuthenticated(retryData.authenticated);
        } catch (refreshErr) {
          console.error('Authentication failed completely:', refreshErr);
          setIsAuthenticated(false);
        }
      } finally {
        setIsAuthLoading(false);
      }
    };
  
    checkAuth();
  }, []);  

  // email check
  useEffect(() => {
    const isValidEmail = validateEmail(formData.email || '');

    if (!isValidEmail || isEmailAvailable === null) return;

    setErrors(prev => ({
      ...prev,
      email: '',
    }));
  }, [isEmailAvailable, formData.email, activeTab]);

  // username check
  useEffect(() => {
    const isOnSignup = activeTab === 1;
    const isValidLocally = !validateLocalUsername(formData.username || '');

    if (!isOnSignup || !isValidLocally || isUsernameAvailable === null) return;

    setErrors(prev => ({
      ...prev,
      username: '',
    }));
  }, [isUsernameAvailable, formData.username, activeTab]);

  useEffect(() => {
    if (registrationError) {
      setErrors(prev => ({
        ...prev,
        form: `Registration failed: ${registrationError.message}`,
      }));
    }
  }, [registrationError]);

  const resetForm = useCallback(() => {
    setFormData(initialFormState);
    setErrors(initialErrorState);
    setTouched(initialTouchedState);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      const fieldName = name as keyof typeof formData;

      if (fieldName === 'username') {
        setFormData(prev => ({ ...prev, username: value, displayName: value }));
        setTouched(prev => ({ ...prev, username: true, displayName: true }));
        setErrors(prev => ({ ...prev, username: validateLocalUsername(value) }));
      } else {
        setFormData(prev => ({ ...prev, [fieldName]: value }));
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        debouncedValidate(fieldName, value);
      }
    },
    [debouncedValidate]
  );

  const validateForm = useCallback(() => {
    const newErrors = {
      ...initialErrorState,
      email: validateEmail(formData.email || ''),
      password: validatePassword(formData.password || ''),
      username: activeTab === 1 ? validateLocalUsername(formData.username || '') : '',
      displayName: activeTab === 1 ? validateDisplayName(formData.displayName || '') : '',
      confirmPassword: activeTab === 1
        ? validateConfirmPassword(formData.confirmPassword || '', formData.password || '')
        : '',
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  }, [activeTab, formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors(prev => ({ ...prev, form: '' }));

    try {
      const authResult = activeTab === 0
        ? await login(formData as LoginData)
        : await register({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            displayName: formData.displayName,
          } as RegisterData);

      resetForm();

      if (authResult?.success) {
        setIsAuthenticated(true);
        onAuthSuccess?.(); // navigation
      } else {
        throw new Error(authResult?.error || 'Authentication failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setErrors(prev => ({
        ...prev,
        form: activeTab === 0
          ? `Sign in failed: ${errorMessage}`
          : `Registration failed: ${errorMessage}`,
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [activeTab, formData, validateForm, register, login, resetForm, onAuthSuccess]);

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
    console.log('Redirecting to Google OAuth...');
    // To be implemented
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
    isCheckingEmail,
    validateForm,
    isAuthenticated,
    isAuthLoading,
    setIsAuthenticated,
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
    isCheckingEmail,
    validateForm,
    isAuthenticated,
    isAuthLoading,
    setIsAuthenticated,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
