var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Database from '../../../../src/database/config/db-connection';
import AuthenticationService from '../../../../src/services/access_management/AuthenticationService';
import UserModel from '../../../../src/models/access_management/UserModel';
import TokenManagementService from '../../../../src/services/access_management/JwtTokenManagementService';
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
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.query('DELETE FROM "UserMetadata"');
    yield db.query('DELETE FROM "User"');
    yield db.query(`INSERT INTO "User" (user_id, username, email, password_hash, token_version, email_verified)
     VALUES ($1, $2, $3, $4, $5, $6)`, [testUser.user_id, testUser.username, testUser.email, testUser.password_hash, testUser.token_version, testUser.email_verified]);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.query('DELETE FROM "UserMetadata"');
    yield db.query('DELETE FROM "User"');
    yield db.close();
}));
describe('AuthenticationService (Integration)', () => {
    it('should login with correct credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const tokens = yield authService.login(testUser.email, testUser.password);
        expect(tokens).toHaveProperty('accessToken');
        expect(tokens).toHaveProperty('refreshToken');
    }));
    it('should fail to login with incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(authService.login(testUser.email, 'wrongpassword')).rejects.toThrow('Invalid password');
    }));
    it('should fail to login with non-existing email', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(authService.login('nonexistent@example.com', 'password123')).rejects.toThrow('User not found');
    }));
    it('should invalidate refresh token on logout', () => __awaiter(void 0, void 0, void 0, function* () {
        yield authService.logout(testUser.user_id);
        const updatedUser = yield userModel.getUserById(testUser.user_id);
        expect(updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.token_version).toBe(testUser.token_version + 1);
    }));
});
