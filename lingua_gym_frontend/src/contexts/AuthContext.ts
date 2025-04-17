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
  isUsernameAvailable: boolean | null;
  isCheckingUsername: boolean;
  activeTab: number;
  isTabSwitching: boolean;
  
  // State setters
  setErrors: React.Dispatch<React.SetStateAction<AuthErrors>>;
  setIsUsernameAvailable: React.Dispatch<React.SetStateAction<boolean | null>>;
  setIsCheckingUsername: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Handlers
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => Promise<void>;
  handleTabChange: (newValue: number) => void;
  handleGoogleLogin: () => void;
  resetForm: () => void;
  debouncedValidate: (name: string, value: string, password: string) => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);