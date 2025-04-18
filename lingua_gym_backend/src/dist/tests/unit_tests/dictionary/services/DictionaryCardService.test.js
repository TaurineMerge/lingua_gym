var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import DictionaryCardService from '../../../../src/services/dictionary/DictionaryCardService.js';
import logger from '../../../../src/utils/logger/Logger.js';
jest.mock('../../../../src/utils/logger/Logger.js', () => ({
    warn: jest.fn(),
    error: jest.fn(),
}));
describe('DictionaryCardService', () => {
    let mockDictionaryCardModel;
    let service;
    const mockCardId = 'test-card-id-123';
    const mockCard = {
        cardId: mockCardId,
        original: 'test',
        transcription: 'tɛst',
        pronunciation: 'protocol://some/url.com'
    };
    const mockTranslations = [
        {
            cardId: mockCardId,
            translationId: 'translation-123',
            translation: 'test',
        }
    ];
    const mockMeanings = [
        {
            cardId: mockCardId,
            dictionaryMeaningId: 'meaning-123',
            meaning: 'test'
        }
    ];
    const mockExamples = [
        {
            cardId: mockCardId,
            exampleId: 'example-123',
            example: 'test',
            translation: 'тест'
        }
    ];
    beforeEach(() => {
        mockDictionaryCardModel = {
            createCard: jest.fn(),
            getCardById: jest.fn(),
            removeCardById: jest.fn(),
        };
        service = new DictionaryCardService(mockDictionaryCardModel);
        jest.clearAllMocks();
    });
    describe('createCard', () => {
        test('should successfully create a card and return ID', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDictionaryCardModel.createCard.mockResolvedValue(mockCardId);
            const result = yield service.createCard(mockCard, mockTranslations, mockMeanings, mockExamples);
            expect(mockDictionaryCardModel.createCard).toHaveBeenCalledWith(mockCard, mockTranslations, mockMeanings, mockExamples);
            expect(result).toBe(mockCardId);
        }));
        test('should handle error and return null when exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDictionaryCardModel.createCard.mockRejectedValue(new Error('DB Error'));
            const result = yield service.createCard(mockCard, mockTranslations, mockMeanings, mockExamples);
            expect(mockDictionaryCardModel.createCard).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
            expect(result).toBeNull();
        }));
    });
    describe('getCardById', () => {
        test('should successfully retrieve card by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDictionaryCardModel.getCardById.mockResolvedValue({
                cardId: mockCard.cardId,
                original: mockCard.original,
                transcription: mockCard.transcription,
                pronunciation: mockCard.pronunciation,
                translation: mockTranslations.map(t => t.translation),
                meaning: mockMeanings.map(m => m.meaning),
                example: mockExamples.map(e => e.example),
            });
            const result = yield service.getCardById(mockCardId);
            expect(mockDictionaryCardModel.getCardById).toHaveBeenCalledWith(mockCardId);
            expect(result).toEqual({
                cardId: mockCard.cardId,
                original: mockCard.original,
                transcription: mockCard.transcription,
                pronunciation: mockCard.pronunciation,
                translation: mockTranslations.map(t => t.translation),
                meaning: mockMeanings.map(m => m.meaning),
                example: mockExamples.map(e => e.example),
            });
        }));
        test('should return null when ID is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.getCardById('');
            expect(mockDictionaryCardModel.getCardById).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toBeNull();
        }));
        test('should handle error and return null when exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDictionaryCardModel.getCardById.mockRejectedValue(new Error('DB Error'));
            const result = yield service.getCardById(mockCardId);
            expect(mockDictionaryCardModel.getCardById).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
            expect(result).toBeNull();
        }));
    });
    describe('removeCardById', () => {
        test('should successfully remove card by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDictionaryCardModel.removeCardById.mockResolvedValue(true);
            const result = yield service.removeCardById(mockCardId);
            expect(mockDictionaryCardModel.removeCardById).toHaveBeenCalledWith(mockCardId);
            expect(result).toBe(true);
        }));
        test('should return false when ID is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.removeCardById('');
            expect(mockDictionaryCardModel.removeCardById).not.toHaveBeenCalled();
            expect(logger.warn).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
        test('should handle error and return false when exception occurs', () => __awaiter(void 0, void 0, void 0, function* () {
            mockDictionaryCardModel.removeCardById.mockRejectedValue(new Error('DB Error'));
            const result = yield service.removeCardById(mockCardId);
            expect(mockDictionaryCardModel.removeCardById).toHaveBeenCalled();
            expect(logger.error).toHaveBeenCalled();
            expect(result).toBe(false);
        }));
    });
});
