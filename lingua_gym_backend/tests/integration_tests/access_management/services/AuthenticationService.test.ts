import Database from '../../../../src/database/config/db-connection.js';
import AuthenticationService from '../../../../src/services/access_management/AuthenticationService.js';
import UserModel from '../../../../src/models/access_management/UserModel.js';
import TokenManagementService from '../../../../src/services/access_management/JwtTokenManagementService.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const db = Database.getInstance();
const userModel = new UserModel(db);
const jwtTokenService = new TokenManagementService(userModel);
const authService = new AuthenticationService(userModel, jwtTokenService);

const testUser = {
  user_id: uuidv4(),
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  password_hash: bcrypt.hashSync('password123', 10),
  token_version: 0,
  email_verified: true,
};

beforeEach(async () => {
  await db.query('DELETE FROM "UserMetadata"');
  await db.query('DELETE FROM "User"');
  await db.query(
    `INSERT INTO "User" (user_id, username, email, password_hash, token_version, email_verified)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [testUser.user_id, testUser.username, testUser.email, testUser.password_hash, testUser.token_version, testUser.email_verified]
  );
});

afterAll(async () => {
  await db.query('DELETE FROM "UserMetadata"');
  await db.query('DELETE FROM "User"');
  await db.close();
});

describe('AuthenticationService (Integration)', () => {
  it('should login with correct credentials', async () => {
    const tokens = await authService.login(testUser.email, testUser.password);

    expect(tokens).toHaveProperty('accessToken');
    expect(tokens).toHaveProperty('refreshToken');
  });

  it('should fail to login with incorrect password', async () => {
    await expect(authService.login(testUser.email, 'wrongpassword')).rejects.toThrow('Invalid password');
  });

  it('should fail to login with non-existing email', async () => {
    await expect(authService.login('nonexistent@example.com', 'password123')).rejects.toThrow('User not found');
  });

  it('should invalidate refresh token on logout', async () => {
    await authService.logout(testUser.user_id);

    const updatedUser = await userModel.getUserById(testUser.user_id);
    expect(updatedUser?.token_version).toBe(testUser.token_version + 1);
  });
});
