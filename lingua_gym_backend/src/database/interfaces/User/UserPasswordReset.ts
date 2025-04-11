interface UserPasswordReset {
  userId: string;
  passwordResetToken: string;
  passwordResetTokenExpiration: Date;
  created_at?: Date;
}

export default UserPasswordReset;