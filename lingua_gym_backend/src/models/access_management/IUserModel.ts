import User from "../database/interfaces/User/User";

interface IUserModel {
    createUser(user: User): Promise<void>;
    getUserById(user_id: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    getUserByUsername(username: string): Promise<User | null>;
    updateUserById(user_id: string, updates: Partial<User>): Promise<void>;
    deleteUserById(user_id: string): Promise<void>;
}

export default IUserModel;