export const validateEmail = (email: string): string => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email';
    return '';
};
  
export const validatePassword = (password: string): string => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return '';
};
  
export const validateUsername = async (
    username: string,
    setIsAvailable: (value: boolean | null) => void,
    setIsChecking: (value: boolean) => void,
    checkUsernameAvailability: (username: string) => Promise<boolean>
): Promise<string> => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters';

    setIsChecking(true);
    const isAvailable = await checkUsernameAvailability(username);
    setIsAvailable(isAvailable);
    setIsChecking(false);

    return isAvailable ? '' : 'Username is already taken';
};
  
export const validateConfirmPassword = (confirmPassword: string, password: string): string => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== password) return 'Passwords do not match';
    return '';
};

export const validateDisplayName = (displayName: string): string => {
    if (!displayName) return 'Display name is required';
    if (displayName.length < 3) return 'Display name must be at least 3 characters';
    return '';
};