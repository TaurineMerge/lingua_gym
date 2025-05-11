import { SetCardModel } from '../../../../src/repositories/dictionary/dictionary.js';
import Database from '../../../../src/database/config/db-connection.js';
import { DictionaryCard } from '../../../../src/database/interfaces/DbInterfaces.js';

describe('SetCardsModel', () => {
    let mockDb: jest.Mocked<Database>;
    let setCardModel: SetCardModel;

    let mockCards: Array<DictionaryCard>;

    beforeEach(() => {
        jest.clearAllMocks();

        mockDb = {
            query: jest.fn(),
        } as unknown as jest.Mocked<Database>;

        setCardModel = new SetCardModel(mockDb as unknown as Database);

        mockCards = [
            { cardId: 'card1', original: 'test1', transcription: 'tɛst1', pronunciation: 'protocol://some/url.com' },
            { cardId: 'card2', original: 'test2', transcription: 'tɛst2', pronunciation: 'protocol://some/url.com' }
        ];
    });

    test('addCardToSet - should insert a card into a set and return the inserted card', async () => {
        const mockCard = mockCards[0];
        mockDb.query.mockResolvedValueOnce({ rows: [mockCard], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await setCardModel.addCardToSet('set1', mockCard.cardId);
        
        expect(result).toEqual(mockCard);
    });

    test('addCardToSet - should throw an error on failure', async () => {
        mockDb.query.mockRejectedValueOnce(new Error('Database error'));
        
        await expect(setCardModel.addCardToSet('set1', 'card1')).rejects.toThrow('Database error');
        expect(mockDb.query).toHaveBeenCalled();
    });

    test('removeCardFromSet - should remove a card from a set and return the removed card', async () => {
        const mockCard = mockCards[0];
        mockDb.query.mockResolvedValueOnce({ rows: [mockCard], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await setCardModel.removeCardFromSet('set1', mockCard.cardId);
        
        expect(result).toEqual(mockCard);
    });

    test('removeCardFromSet - should return null if no card is removed', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });
        
        const result = await setCardModel.removeCardFromSet('set1', 'card1');
        
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toBeNull();
    });

    test('getCardsBySet - should fetch all cards for a given set', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: mockCards, rowCount: 2, command: 'INSERT', oid: 0, fields: [] });

        const result = await setCardModel.getCardsBySet('set1');
        
        expect(result).toEqual(mockCards);
    });

    test('getCardsBySet - should return null if no cards are found', async () => {
        mockDb.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });

        const result = await setCardModel.getCardsBySet('set1');
        
        expect(mockDb.query).toHaveBeenCalled();
        expect(result).toBeNull();
    });
});
