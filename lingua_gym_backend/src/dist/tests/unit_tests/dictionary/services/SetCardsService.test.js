var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SetCardService } from '../../../../src/services/dictionary/dictionary.js';
import logger from '../../../../src/utils/logger/Logger.js';
jest.mock('../../../../src/utils/logger/Logger.js', () => ({
    warn: jest.fn(),
    error: jest.fn(),
}));
describe('SetCardsService', () => {
    let mockSetCardModel;
    let service;
    const mockSetId = 'test-set-id-123';
    const mockCardId = 'test-card-id-456';
    const mockSetCards = {
        setId: mockSetId,
        cardId: mockCardId
    };
    const mockDictionaryCards = [
        {
            cardId: mockCardId,
            original: 'test',
            transcription: 'tɛst',
            pronunciation: 'protocol://some/url.com'
        }
    ];
    beforeEach(() => {
        mockSetCardModel = {
            addCardToSet: jest.fn(),
            removeCardFromSet: jest.fn(),
            getCardsBySet: jest.fn(),
        };
        service = new SetCardService(mockSetCardModel);
        jest.clearAllMocks();
    });
    describe('addCardToSet', () => {
        test('should successfully add a card to a set and return the relation', () => __awaiter(void 0, void 0, void 0, function* () {
            mockSetCardModel.addCardToSet.mockResolvedValue(mockSetCards);
            const result = yield service.addCardToSet(mockSetId, mockCardId);
            expect(mockSetCardModel.addCardToSet).toHaveBeenCalledWith(mockSetId, mockCardId);
            expect(result).toBe(mockSetCards);
        }));
        test('should return false if setId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.addCardToSet('', mockCardId);
            expect(mockSetCardModel.addCardToSet).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should return false if cardId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.addCardToSet(mockSetId, '');
            expect(mockSetCardModel.addCardToSet).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should handle errors and return false when an exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            mockSetCardModel.addCardToSet.mockRejectedValue(new Error('DB Error'));
            const result = yield service.addCardToSet(mockSetId, mockCardId);
            expect(mockSetCardModel.addCardToSet).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should handle when model returns a boolean value', () => __awaiter(void 0, void 0, void 0, function* () {
            mockSetCardModel.addCardToSet.mockResolvedValue(mockSetCards);
            const result = yield service.addCardToSet(mockSetId, mockCardId);
            expect(mockSetCardModel.addCardToSet).toHaveBeenCalledWith(mockSetId, mockCardId);
            expect(result).toBe(mockSetCards);
        }));
    });
    describe('removeCardFromSet', () => {
        test('should successfully remove a card from a set and return the relation', () => __awaiter(void 0, void 0, void 0, function* () {
            mockSetCardModel.removeCardFromSet.mockResolvedValue(mockSetCards);
            const result = yield service.removeCardFromSet(mockSetId, mockCardId);
            expect(mockSetCardModel.removeCardFromSet).toHaveBeenCalledWith(mockSetId, mockCardId);
            expect(result).toBe(mockSetCards);
        }));
        test('should return false if setId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.removeCardFromSet('', mockCardId);
            expect(mockSetCardModel.removeCardFromSet).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should return false if cardId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.removeCardFromSet(mockSetId, '');
            expect(mockSetCardModel.removeCardFromSet).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should handle errors and return false when an exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            mockSetCardModel.removeCardFromSet.mockRejectedValue(new Error('DB Error'));
            const result = yield service.removeCardFromSet(mockSetId, mockCardId);
            expect(mockSetCardModel.removeCardFromSet).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should handle when model returns a boolean value', () => __awaiter(void 0, void 0, void 0, function* () {
            mockSetCardModel.removeCardFromSet.mockResolvedValue(mockSetCards);
            const result = yield service.removeCardFromSet(mockSetId, mockCardId);
            expect(mockSetCardModel.removeCardFromSet).toHaveBeenCalledWith(mockSetId, mockCardId);
            expect(result).toBe(mockSetCards);
        }));
    });
    describe('getCardsForSet', () => {
        test('should successfully retrieve cards for a set', () => __awaiter(void 0, void 0, void 0, function* () {
            mockSetCardModel.getCardsBySet.mockResolvedValue(mockDictionaryCards);
            const result = yield service.getCardsForSet(mockSetId);
            expect(mockSetCardModel.getCardsBySet).toHaveBeenCalledWith(mockSetId);
            expect(result).toEqual(mockDictionaryCards);
        }));
        test('should return empty array if setId is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getCardsForSet('');
            expect(mockSetCardModel.getCardsBySet).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toEqual([]);
        }));
        test('should handle errors and return empty array when an exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            mockSetCardModel.getCardsBySet.mockRejectedValue(new Error('DB Error'));
            const result = yield service.getCardsForSet(mockSetId);
            expect(mockSetCardModel.getCardsBySet).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
            expect(result).toEqual([]);
        }));
    });
});
