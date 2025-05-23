enum RegistrationMethod {
  LOCAL = 'local',
  GOOGLE = 'google',
}

interface IUser {
  userId: string;
  username: string;
  displayName?: string | null;
  passwordHash: string | null;
  email: string;
  profilePicture?: string | null;
  emailVerified: boolean;
  tokenVersion: number;
  registrationMethod: RegistrationMethod;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

export { IUser, RegistrationMethod };