var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Database from '../../../../src/database/config/db-connection.js';
import RegistrationService from '../../../../src/services/access_management/RegistrationService.js';
import { UserModel, UserMetadataModel } from '../../../../src/models/access_management/access_management.js';
import bcrypt from 'bcrypt';
const db = Database.getInstance();
const userModel = new UserModel(db);
const userMetadataModel = new UserMetadataModel(db);
const registrationService = new RegistrationService(userModel, userMetadataModel);
beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.query('DELETE FROM "UserMetadata"');
    yield db.query('DELETE FROM "User"');
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.query('DELETE FROM "UserMetadata"');
    yield db.query('DELETE FROM "User"');
    yield db.close();
}));
describe('RegistrationService (Integration)', () => {
    it('should register a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const password = 'password';
        const user = {
            username: 'testuser',
            display_name: null,
            email: 'test@example.com',
            token_version: 0,
            email_verified: false,
        };
        yield registrationService.register(user.username, user.email, password);
        const userResult = yield userModel.getUserByEmail('test@example.com');
        expect(userResult).toMatchObject(Object.assign(Object.assign({}, user), { password_hash: expect.any(String), user_id: expect.any(String) }));
        expect(bcrypt.compareSync(password, (userResult === null || userResult === void 0 ? void 0 : userResult.password_hash) == null ? expect.any(String) : userResult.password_hash)).toBe(true);
        const metadataResult = yield userMetadataModel.getUserMetadataById((userResult === null || userResult === void 0 ? void 0 : userResult.user_id) == null ? expect.any(String) : userResult.user_id);
        expect(metadataResult).toMatchObject({ user_id: (userResult === null || userResult === void 0 ? void 0 : userResult.user_id) == null ? expect.any(String) : userResult.user_id, signup_date: expect.any(Date), last_login: null });
    }));
    it('should fail if email already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield registrationService.register('testuser', 'test@example.com', 'password123');
        yield expect(registrationService.register('anotheruser', 'test@example.com', 'password456')).rejects.toThrow('Email already exists');
    }));
    it('should fail if username already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        yield registrationService.register('testuser', 'test@example.com', 'password123');
        yield expect(registrationService.register('testuser', 'newemail@example.com', 'password456')).rejects.toThrow('Username already exists');
    }));
});
