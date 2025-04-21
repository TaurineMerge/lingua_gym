import { User } from "./UserTypes";

export type AuthFormData = {
    email: string;
    password: string;
    username: string;
    confirmPassword: string;
  };
  
  export type AuthErrors = AuthFormData & {
    form: string;
    email: string;
    password: string;
    username: string;
    displayName: string;
    confirmPassword: string;
  };
  
  export type TouchedFields = {
    email: boolean;
    password: boolean;
    username: boolean;
    confirmPassword: boolean;
  };
  
  export type AuthContextType = {
    user: User | null;
    isAuthLoading: boolean;
    formData: AuthFormData;
    errors: AuthErrors;
    touched: TouchedFields;
    isSubmitting: boolean;
    isUsernameAvailable: boolean | null;
    isCheckingUsername: boolean;
    activeTab: number;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => Promise<void>;
    handleTabChange: (newValue: number) => void;
    handleGoogleLogin: () => void;
  };