var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import DictionarySetService from '../../../../src/services/dictionary/DictionarySetService';
import { LanguageCode } from '../../../../src/database/interfaces/DbInterfaces.js';
import logger from '../../../../src/utils/logger/Logger.js';
jest.mock('../../../../src/utils/logger/Logger.js', () => ({
    warn: jest.fn(),
    error: jest.fn(),
}));
describe('DictionarySetService', () => {
    let mockDictionarySetModel;
    let service;
    const mockSetId = 'test-set-id-123';
    const mockSet = {
        dictionarySetId: mockSetId,
        name: 'Test Set',
        ownerId: 'owner-123',
        description: 'Test set description',
        isPublic: false,
        languageCode: LanguageCode.ENGLISH,
    };
    beforeEach(() => {
        mockDictionarySetModel = {
            createSet: jest.fn(),
            deleteSet: jest.fn(),
            getSetById: jest.fn(),
        };
        service = new DictionarySetService(mockDictionarySetModel);
        jest.clearAllMocks();
    });
    describe('createSet', () => {
        test('should successfully create a set and return it', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDictionarySetModel.createSet.mockResolvedValue(mockSet);
            const result = yield service.createSet(mockSet);
            expect(mockDictionarySetModel.createSet).toHaveBeenCalledWith(mockSet);
            expect(result).toBe(mockSet);
        }));
        test('should handle errors and return null when an exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDictionarySetModel.createSet.mockRejectedValue(new Error('DB Error'));
            const result = yield service.createSet(mockSet);
            expect(mockDictionarySetModel.createSet).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
            expect(result).toBeNull();
        }));
    });
    describe('deleteSet', () => {
        test('should successfully delete a set and return it', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDictionarySetModel.deleteSet.mockResolvedValue(mockSet);
            const result = yield service.deleteSet(mockSetId);
            expect(mockDictionarySetModel.deleteSet).toHaveBeenCalledWith(mockSetId);
            expect(result).toEqual(mockSet);
        }));
        test('should return false if setId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.deleteSet('');
            expect(mockDictionarySetModel.deleteSet).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should handle errors and return false when an exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDictionarySetModel.deleteSet.mockRejectedValue(new Error('DB Error'));
            const result = yield service.deleteSet(mockSetId);
            expect(mockDictionarySetModel.deleteSet).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should handle when model returns a boolean value', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDictionarySetModel.deleteSet.mockResolvedValue(mockSet);
            const result = yield service.deleteSet(mockSetId);
            expect(mockDictionarySetModel.deleteSet).toHaveBeenCalledWith(mockSetId);
            expect(result).toBe(mockSet);
        }));
    });
    describe('getSetById', () => {
        test('should successfully retrieve a set by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDictionarySetModel.getSetById.mockResolvedValue(mockSet);
            const result = yield service.getSetById(mockSetId);
            expect(mockDictionarySetModel.getSetById).toHaveBeenCalledWith(mockSetId);
            expect(result).toEqual(mockSet);
        }));
        test('should handle errors and return null when an exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDictionarySetModel.getSetById.mockRejectedValue(new Error('DB Error'));
            const result = yield service.getSetById(mockSetId);
            expect(mockDictionarySetModel.getSetById).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
            expect(result).toBeNull();
        }));
    });
});
