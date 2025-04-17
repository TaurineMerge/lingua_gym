export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    // Mock
    await new Promise(resolve => setTimeout(resolve, 500));
    return !['admin', 'user'].includes(username.toLowerCase());
};