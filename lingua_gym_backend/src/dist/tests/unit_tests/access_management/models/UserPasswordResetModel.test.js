var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import UserPasswordResetModel from '../../../../src/models/access_management/UserPasswordResetModel';
jest.mock('../../../../src/database/config/db-connection');
const mockDb = {
    query: jest.fn(),
};
const userPasswordResetModel = new UserPasswordResetModel(mockDb);
const mockResetEntry = {
    user_id: '123',
    password_reset_token: 'reset-token',
    password_reset_token_expiration: new Date(Date.now() + 3600000),
};
describe('UserPasswordResetModel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('createResetEntry() should insert a new reset entry', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValue({});
        yield userPasswordResetModel.createResetEntry(mockResetEntry);
        expect(mockDb.query).toHaveBeenCalledWith('INSERT INTO "UserPasswordReset" (user_id, password_reset_token, password_reset_token_expiration) VALUES ($1, $2, $3)', [mockResetEntry.user_id, mockResetEntry.password_reset_token, mockResetEntry.password_reset_token_expiration]);
    }));
    test('getByToken() should return a reset entry if found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValue({
            rows: [mockResetEntry],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
        });
        const result = yield userPasswordResetModel.getByToken(mockResetEntry.password_reset_token);
        expect(mockDb.query).toHaveBeenCalledWith('SELECT * FROM "UserPasswordReset" WHERE password_reset_token = $1', [mockResetEntry.password_reset_token]);
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
        yield userPasswordResetModel.invalidateToken(mockResetEntry.password_reset_token);
        expect(mockDb.query).toHaveBeenCalledWith('DELETE FROM "UserPasswordReset" WHERE password_reset_token = $1', [mockResetEntry.password_reset_token]);
    }));
    test('deleteRequestByUserId() should delete requests by user_id', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValue({});
        yield userPasswordResetModel.deleteRequestByUserId(mockResetEntry.user_id);
        expect(mockDb.query).toHaveBeenCalledWith('DELETE FROM "UserPasswordReset" WHERE user_id = $1', [mockResetEntry.user_id]);
    }));
    test('deleteExpiredRequests() should delete expired requests', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValue({});
        yield userPasswordResetModel.deleteExpiredRequests();
        expect(mockDb.query).toHaveBeenCalledWith('DELETE FROM "UserPasswordReset" WHERE password_reset_token_expiration <= NOW()');
    }));
});
