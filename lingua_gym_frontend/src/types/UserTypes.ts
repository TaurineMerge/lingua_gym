export interface User {
    _id: string;
    username: string;
    email: string;
    displayName?: string;
    createdAt?: string;
    updatedAt?: string;
    profilePicture?: string;
    emailVerified: boolean;
    __v: number;
}