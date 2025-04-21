var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserSetService } from '../../../../src/services/dictionary/dictionary.js';
import { Permission } from '../../../../src/database/interfaces/DbInterfaces.js';
import logger from '../../../../src/utils/logger/Logger.js';
jest.mock('../../../../src/utils/logger/Logger.js', () => ({
    warn: jest.fn(),
    error: jest.fn(),
}));
describe('UserSetsService', () => {
    let mockUserSetsModel;
    let service;
    const mockUserId = 'test-user-id-123';
    const mockSetId = 'test-set-id-456';
    const mockPermission = Permission.READ;
    const mockUserSet = {
        userId: mockUserId,
        setId: mockSetId,
        permission: mockPermission
    };
    const mockUserSetsArray = [
        mockUserSet,
        {
            userId: 'another-user-id',
            setId: mockSetId,
            permission: mockPermission,
        }
    ];
    beforeEach(() => {
        mockUserSetsModel = {
            addUserToSet: jest.fn(),
            removeUserFromSet: jest.fn(),
            getUserSets: jest.fn(),
            getUsersBySet: jest.fn(),
        };
        service = new UserSetService(mockUserSetsModel);
        jest.clearAllMocks();
    });
    describe('addUserSet', () => {
        test('should successfully add a user to a set and return the relation', () => __awaiter(void 0, void 0, void 0, function* () {
            mockUserSetsModel.addUserToSet.mockResolvedValue(mockUserSet);
            const result = yield service.addUserSet(mockUserId, mockSetId, mockPermission);
            expect(mockUserSetsModel.addUserToSet).toHaveBeenCalledWith(mockUserId, mockSetId, mockPermission);
            expect(result).toBe(mockUserSet);
        }));
        test('should return false if userId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.addUserSet('', mockSetId, mockPermission);
            expect(mockUserSetsModel.addUserToSet).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should return false if setId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.addUserSet(mockUserId, '', mockPermission);
            expect(mockUserSetsModel.addUserToSet).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should return false if permission is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.addUserSet(mockUserId, mockSetId, null);
            expect(mockUserSetsModel.addUserToSet).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should handle errors and return false when an exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            mockUserSetsModel.addUserToSet.mockRejectedValue(new Error('DB Error'));
            const result = yield service.addUserSet(mockUserId, mockSetId, mockPermission);
            expect(mockUserSetsModel.addUserToSet).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should handle when model returns a boolean value', () => __awaiter(void 0, void 0, void 0, function* () {
            mockUserSetsModel.addUserToSet.mockResolvedValue(mockUserSet);
            const result = yield service.addUserSet(mockUserId, mockSetId, mockPermission);
            expect(mockUserSetsModel.addUserToSet).toHaveBeenCalledWith(mockUserId, mockSetId, mockPermission);
            expect(result).toBe(mockUserSet);
        }));
    });
    describe('removeUserSet', () => {
        test('should successfully remove a user from a set and return the relation', () => __awaiter(void 0, void 0, void 0, function* () {
            mockUserSetsModel.removeUserFromSet.mockResolvedValue(mockUserSet);
            const result = yield service.removeUserSet(mockUserId, mockSetId);
            expect(mockUserSetsModel.removeUserFromSet).toHaveBeenCalledWith(mockUserId, mockSetId);
            expect(result).toBe(mockUserSet);
        }));
        test('should return false if userId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.removeUserSet('', mockSetId);
            expect(mockUserSetsModel.removeUserFromSet).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should return false if setId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.removeUserSet(mockUserId, '');
            expect(mockUserSetsModel.removeUserFromSet).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should handle errors and return false when an exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            mockUserSetsModel.removeUserFromSet.mockRejectedValue(new Error('DB Error'));
            const result = yield service.removeUserSet(mockUserId, mockSetId);
            expect(mockUserSetsModel.removeUserFromSet).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should handle when model returns a boolean value', () => __awaiter(void 0, void 0, void 0, function* () {
            mockUserSetsModel.removeUserFromSet.mockResolvedValue(mockUserSet);
            const result = yield service.removeUserSet(mockUserId, mockSetId);
            expect(mockUserSetsModel.removeUserFromSet).toHaveBeenCalledWith(mockUserId, mockSetId);
            expect(result).toBe(mockUserSet);
        }));
    });
    describe('getUserSets', () => {
        test('should successfully retrieve sets for a user', () => __awaiter(void 0, void 0, void 0, function* () {
            mockUserSetsModel.getUserSets.mockResolvedValue(mockUserSetsArray);
            const result = yield service.getUserSets(mockUserId);
            expect(mockUserSetsModel.getUserSets).toHaveBeenCalledWith(mockUserId);
            expect(result).toEqual(mockUserSetsArray);
        }));
        test('should return empty array if userId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getUserSets('');
            expect(mockUserSetsModel.getUserSets).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toEqual([]);
        }));
        test('should handle errors and return empty array when an exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            mockUserSetsModel.getUserSets.mockRejectedValue(new Error('DB Error'));
            const result = yield service.getUserSets(mockUserId);
            expect(mockUserSetsModel.getUserSets).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
            expect(result).toEqual([]);
        }));
    });
    describe('getUsersForSet', () => {
        test('should successfully retrieve users for a set', () => __awaiter(void 0, void 0, void 0, function* () {
            mockUserSetsModel.getUsersBySet.mockResolvedValue(mockUserSetsArray);
            const result = yield service.getUsersForSet(mockSetId);
            expect(mockUserSetsModel.getUsersBySet).toHaveBeenCalledWith(mockSetId);
            expect(result).toEqual(mockUserSetsArray);
        }));
        test('should return empty array if setId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getUsersForSet('');
            expect(mockUserSetsModel.getUsersBySet).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toEqual([]);
        }));
        test('should handle errors and return empty array when an exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            mockUserSetsModel.getUsersBySet.mockRejectedValue(new Error('DB Error'));
            const result = yield service.getUsersForSet(mockSetId);
            expect(mockUserSetsModel.getUsersBySet).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
            expect(result).toEqual([]);
        }));
    });
});
