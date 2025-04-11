import { DictionaryCardModel } from '../../../../src/models/dictionary/dictionary.js';
import Database from '../../../../src/database/config/db-connection.js';
import {  DictionaryCard, CardTranslation, CardMeaning, CardExample, Tag } from '../../../../src/database/interfaces/DbInterfaces.js';
import { CardTagModel } from '../../../../src/models/tag/tag.js';

describe('DictionaryCardModel', () => {
    let dbMock: jest.Mocked<Database>;
    let cardModel: DictionaryCardModel;
    let cardTagModel: CardTagModel;

    let card: DictionaryCard;
    let cardId: string;
    let cardName: string;
    let cardTranscription: string;
    let cardPronunciation: string;
    let cardTranslations: Array<CardTranslation>;
    let cardMeanings: Array<CardMeaning>;
    let cardExamples: Array<CardExample>;

    let tags: Array<Tag>;

    beforeAll(() => {
        cardId = 'card-123';
        cardName = 'test';
        cardTranscription = 'tɛst';
        cardPronunciation = 'protocol://some/url.com';
        
        tags = [{ tagId: 'tag-123', name: 'tag1' }, { tagId: 'tag-456', name: 'tag2' }];

        card = {
            cardId: cardId,
            original: cardName,
            transcription: cardTranscription,
            pronunciation: cardPronunciation,
        };

        cardTranslations = [{ cardId: cardId, translation: 'тест', translationId: 'translation-123' }];
        cardMeanings = [{ cardId: cardId, meaning: 'a trial', dictionaryMeaningId: 'meaning-123' }];
        cardExamples = [{ 
            cardId: cardId, example: 'This is a test', exampleId: 'example-123', translation: 'тест' }, 
            { cardId: cardId, example: 'This is another test', exampleId: 'example-456', translation: 'тест' }
        ];
    });

    beforeEach(() => {
        dbMock = {
            query: jest.fn(),
        } as unknown as jest.Mocked<Database>;

        cardModel = new DictionaryCardModel(dbMock);

        cardTagModel = new CardTagModel(dbMock);
    });

    test('createCard should insert card and return ID', async () => {
        dbMock.query
            .mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValueOnce({ rows: [{ cardId: cardId }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValue({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });

        const result = await cardModel.createCard(
            card,
            cardTranslations,
            cardMeanings,
            cardExamples
        );

        expect(result).toBe(cardId);
    });

    test('removeCardById should delete a card and return true', async () => {
        dbMock.query.mockResolvedValue({ rows: [{ dictionaryCardId: cardId }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await cardModel.removeCardById(cardId);

        expect(result).toBe(true);
    });

    test('removeCardById should return false if no card was deleted', async () => {
        dbMock.query.mockResolvedValue({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });

        const result = await cardModel.removeCardById(cardId);

        expect(result).toBe(false);
    });

    test('getCardById should return card details', async () => {
        dbMock.query
            .mockResolvedValueOnce({ rows: [{ dictionaryCardId: cardId, original: cardName }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValueOnce({ rows: [{ translation: (cardTranslations.map((t) => t.translation)) }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValueOnce({ rows: [{ meaning: (cardMeanings.map((m) => m.meaning)) }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValueOnce({ rows: [{ example: (cardExamples.map((e) => e.example)) }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });

        const result = await cardModel.getCardById(cardId);

        expect(result).toEqual({
            dictionaryCardId: cardId,
            original: cardName,
            translation: cardTranslations.map((t) => t.translation),
            meaning: cardMeanings.map((m) => m.meaning),
            example: cardExamples.map((e) => e.example),
        });
    });

    test('updateCard should update card details and return true', async () => {
        dbMock.query.mockResolvedValue({ rowCount: 1, command: 'UPDATE', oid: 0, fields: [], rows: [] });

        const updatedCard = { ...card, original: 'updatedTest' };
        const updatedTranslations = [{ dictionaryCardId: cardId, translation: 'обновленный тест', translationId: 'translation-456', cardId: cardId }];
        const updatedMeanings = [{ dictionaryCardId: cardId, meaning: 'updated trial', dictionaryMeaningId: 'meaning-456', cardId: cardId }];
        const updatedExamples = [{ dictionaryCardId: cardId, example: 'This is an updated test', exampleId: 'example-789', translation: 'обновленный тест', cardId: cardId }];

        const result = await cardModel.updateCard(
            cardId,
            updatedCard,
            updatedTranslations,
            updatedMeanings,
            updatedExamples
        );

        expect(result).toBe(true);
    });

    test('addTagToCard should return true if tag added', async () => {
        dbMock.query.mockResolvedValueOnce({ rowCount: 1, command: 'INSERT', oid: 0, fields: [], rows: [] });

        const result = await cardTagModel.addTagToCard('card-123', 'tag-456');

        expect(result).toBe(true);
    });

    test('removeTagFromCard should return true if tag removed', async () => {
        dbMock.query.mockResolvedValueOnce({ rowCount: 1, command: 'DELETE', oid: 0, fields: [], rows: [] });

        const result = await cardTagModel.removeTagFromCard('card-123', 'tag-456');

        expect(result).toBe(true);
    });

    test('getTagsForCard should return an array of tag names', async () => {
        dbMock.query.mockResolvedValueOnce({ rows: [{ name: tags[0].name }, { name: tags[1].name }], rowCount: 2, command: 'INSERT', oid: 0, fields: [] });

        const result = await cardTagModel.getTagsForCard(cardId);

        expect(result).toEqual([tags[0].name, tags[1].name]);
    });
});
