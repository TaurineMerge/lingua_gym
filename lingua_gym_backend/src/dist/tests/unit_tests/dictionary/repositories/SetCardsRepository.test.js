var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SetCardRepository } from '../../../../src/repositories/dictionary/dictionary.js';
describe('SetCardsModel', () => {
    let mockDb;
    let setCardModel;
    let mockCards;
    beforeEach(() => {
        jest.clearAllMocks();
        mockDb = {
            query: jest.fn(),
        };
        setCardModel = new SetCardRepository(mockDb);
        mockCards = [
            { cardId: 'card1', original: 'test1', transcription: 'tɛst1', pronunciation: 'protocol://some/url.com' },
            { cardId: 'card2', original: 'test2', transcription: 'tɛst2', pronunciation: 'protocol://some/url.com' }
        ];
    });
    test('addCardToSet - should insert a card into a set and return the inserted card', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCard = mockCards[0];
        mockDb.query.mockResolvedValueOnce({ rows: [mockCard], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield setCardModel.addCardToSet('set1', mockCard.cardId);
        expect(result).toEqual(mockCard);
    }));
    test('addCardToSet - should throw an error on failure', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockRejectedValueOnce(new Error('Database error'));
        yield expect(setCardModel.addCardToSet('set1', 'card1')).rejects.toThrow('Database error');
        expect(mockDb.query).toHaveBeenCalled();
    }));
    test('removeCardFromSet - should remove a card from a set and return the removed card', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockCard = mockCards[0];
        mockDb.query.mockResolvedValueOnce({ rows: [mockCard], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield setCardModel.removeCardFromSet('set1', mockCard.cardId);
        expect(result).toEqual(mockCard);
    }));
    test('removeCardFromSet - should return null if no card is removed', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });
        const result = yield setCardModel.removeCardFromSet('set1', 'card1');
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toBeNull();
    }));
    test('getCardsBySet - should fetch all cards for a given set', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: mockCards, rowCount: 2, command: 'INSERT', oid: 0, fields: [] });
        const result = yield setCardModel.getCardsBySet('set1');
        expect(result).toEqual(mockCards);
    }));
    test('getCardsBySet - should return null if no cards are found', () => __awaiter(void 0, void 0, void 0, function* () {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });
        const result = yield setCardModel.getCardsBySet('set1');
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toBeNull();
    }));
});
