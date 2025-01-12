interface UserPasswordReset {
  user_id: string;
  password_reset_token: string;
  password_reset_token_expiration: Date;
}

export default UserPasswordReset;