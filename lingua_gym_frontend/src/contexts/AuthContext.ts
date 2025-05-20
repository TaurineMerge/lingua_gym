import { createContext } from 'react';

interface AuthFormData {
  email: string;
  password: string;
  username: string;
  displayName: string;
  confirmPassword: string;
}

interface AuthErrors extends AuthFormData {
  form: string;
}

interface TouchedFields {
  email: boolean;
  password: boolean;
  username: boolean;
  displayName: boolean;
  confirmPassword: boolean;
}

interface AuthContextType {
  // State values
  formData: AuthFormData;
  errors: AuthErrors;
  touched: TouchedFields;
  isSubmitting: boolean;
  activeTab: number;
  isTabSwitching: boolean;
  isUsernameAvailable: boolean | null;
  isCheckingUsername: boolean;
  isEmailAvailable: boolean | null;
  isCheckingEmail: boolean;
  isAuthLoading: boolean;
  isAuthenticated: boolean | null;

  // State setters
  setErrors: React.Dispatch<React.SetStateAction<AuthErrors>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean | null>>;

  // Handlers
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => Promise<void>;
  handleTabChange: (newValue: number) => void;
  //handleGoogleLogin: (credentialResponse: CredentialResponse) => void;
  resetForm: () => void;
  debouncedValidate: (name: string, value: string, password?: string) => void;
  validateForm: () => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
