interface User {
  user_id: string;
  username: string;
  display_name?: string;
  password_hash: string;
  email: string;
  profile_picture?: string;
  email_verified: boolean;
  token_version: number;
}

export default User;