var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserPasswordResetRepository } from '../../../../src/repositories/access_management/access_management.js';
jest.mock('../../../../src/database/config/db-connection');
const mockDb = {
    query: jest.fn(),
};
const userPasswordResetModel = new UserPasswordResetRepository(mockDb);
const mockResetEntry = {
    userId: '123',
    passwordResetToken: 'reset-token',
    passwordResetTokenExpiration: new Date(Date.now() + 3600000),
};
describe('UserPasswordResetModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('createResetEntry() should insert a new reset entry', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValue({});
        yield userPasswordResetModel.createResetEntry(mockResetEntry);
        expect(mockDb.query).toHaveBeenCalledWith('INSERT INTO "UserPasswordReset" (user_id, password_reset_token, password_reset_token_expiration) VALUES ($1, $2, $3)', [mockResetEntry.userId, mockResetEntry.passwordResetToken, mockResetEntry.passwordResetTokenExpiration]);
    }));
    test('getByToken() should return a reset entry if found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValue({
            rows: [mockResetEntry],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
        });
        const result = yield userPasswordResetModel.getByToken(mockResetEntry.passwordResetToken);
        expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM "UserPasswordReset" WHERE password_reset_token = $1', [mockResetEntry.passwordResetToken]);
        expect(result).toEqual(mockResetEntry);
    }));
    test('getByToken() should return null if no entry found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValue({
            rows: [],
            rowCount: 0,
            command: 'SELECT',
            oid: 0,
            fields: [],
        });
        const result = yield userPasswordResetModel.getByToken('invalid-token');
        expect(result).toBeNull();
    }));
    test('invalidateToken() should delete the reset token', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValue({});
        yield userPasswordResetModel.invalidateToken(mockResetEntry.passwordResetToken);
        expect(mockDb.query).toHaveBeenCalledWith('DELETE FROM "UserPasswordReset" WHERE password_reset_token = $1', [mockResetEntry.passwordResetToken]);
    }));
    test('deleteRequestByUserId() should delete requests by user_id', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValue({});
        yield userPasswordResetModel.deleteRequestByUserId(mockResetEntry.userId);
        expect(mockDb.query).toHaveBeenCalledWith('DELETE FROM "UserPasswordReset" WHERE user_id = $1', [mockResetEntry.userId]);
    }));
    test('deleteExpiredRequests() should delete expired requests', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValue({});
        yield userPasswordResetModel.deleteExpiredRequests();
        expect(mockDb.query).toHaveBeenCalledWith('DELETE FROM "UserPasswordReset" WHERE password_reset_token_expiration <= NOW()');
    }));
});
