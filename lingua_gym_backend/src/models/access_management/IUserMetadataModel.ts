import UserMetadata from '../../database/interfaces/User/UserMetadata';

interface IUserMetadataModel {
    createUserMetadata(userMetadata: UserMetadata): Promise<void>;
    getUserMetadataById(user_id: string): Promise<UserMetadata | null>;
    updateUserMetadataById(user_id: string, updates: Partial<UserMetadata>): Promise<void>;
    deleteUserMetadataById(user_id: string): Promise<void>;
}

export default IUserMetadataModel;