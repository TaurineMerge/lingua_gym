interface IUser {
  userId: string;
  username: string;
  displayName?: string | null;
  passwordHash: string;
  email: string;
  profilePicture?: string | null;
  emailVerified: boolean;
  tokenVersion: number;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export default IUser;