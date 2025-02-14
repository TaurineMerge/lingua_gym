import UserMetadata from '../../database/interfaces/User/UserMetadata';

interface UserPasswordResetModel {
    createUserMetadata(userMetadata: UserMetadata): Promise<void>;
    getUserMetadataById(user_id: string): Promise<UserMetadata | null>;
    updateUserMetadata(user_id: string, updates: Partial<UserMetadata>): Promise<void>;
    deleteUserMetadata(user_id: string): Promise<void>;
}

export default UserPasswordResetModel;