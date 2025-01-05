interface User {
  user_id: string;
  username: string;
  display_name?: string;
  password_hash: string;
  email: string;
  profile_picture?: string;
  email_verified: boolean;
}

interface UserPasswordReset {
  user_id: string;
  password_reset_token: string;
  password_reset_token_expiration: Date;
}

interface UserMetadata {
  user_id: string;
  last_login?: Date;
  signup_date: Date;
}

export { User, UserPasswordReset, UserMetadata };