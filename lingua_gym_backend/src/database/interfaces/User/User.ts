interface User {
  userId: string;
  username: string;
  displayName?: string;
  passwordHash: string;
  email: string;
  profilePicture?: string;
  emailVerified: boolean;
  tokenVersion: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export default User;