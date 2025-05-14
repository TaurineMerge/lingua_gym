var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DictionaryCardModel } from '../../../../src/repositories/dictionary/dictionary.js';
import { CardTagModel } from '../../../../src/repositories/tag/tag.js';
describe('DictionaryCardModel', () => {
    let dbMock;
    let cardModel;
    let cardTagModel;
    let card;
    let cardId;
    let cardName;
    let cardTranscription;
    let cardPronunciation;
    let cardTranslations;
    let cardMeanings;
    let cardExamples;
    let tags;
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
                cardId: cardId, example: 'This is a test', exampleId: 'example-123', translation: 'тест'
            },
            { cardId: cardId, example: 'This is another test', exampleId: 'example-456', translation: 'тест' }
        ];
    });
    beforeEach(() => {
        dbMock = {
            query: jest.fn(),
        };
        cardModel = new DictionaryCardModel(dbMock);
        cardTagModel = new CardTagModel(dbMock);
    });
    test('createCard should insert card and return ID', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query
            .mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValueOnce({ rows: [{ cardId: cardId }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValue({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });
        const result = yield cardModel.createCard(card, cardTranslations, cardMeanings, cardExamples);
        expect(result).toBe(cardId);
    }));
    test('removeCardById should delete a card and return true', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValue({ rows: [{ dictionaryCardId: cardId }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield cardModel.removeCardById(cardId);
        expect(result).toBe(true);
    }));
    test('removeCardById should return false if no card was deleted', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValue({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });
        const result = yield cardModel.removeCardById(cardId);
        expect(result).toBe(false);
    }));
    test('getCardById should return card details', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query
            .mockResolvedValueOnce({ rows: [{ dictionaryCardId: cardId, original: cardName }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValueOnce({ rows: [{ translation: (cardTranslations.map((t) => t.translation)) }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValueOnce({ rows: [{ meaning: (cardMeanings.map((m) => m.meaning)) }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValueOnce({ rows: [{ example: (cardExamples.map((e) => e.example)) }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield cardModel.getCardById(cardId);
        expect(result).toEqual({
            dictionaryCardId: cardId,
            original: cardName,
            translation: cardTranslations.map((t) => t.translation),
            meaning: cardMeanings.map((m) => m.meaning),
            example: cardExamples.map((e) => e.example),
        });
    }));
    test('updateCard should update card details and return true', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValue({ rowCount: 1, command: 'UPDATE', oid: 0, fields: [], rows: [] });
        const updatedCard = Object.assign(Object.assign({}, card), { original: 'updatedTest' });
        const updatedTranslations = [{ dictionaryCardId: cardId, translation: 'обновленный тест', translationId: 'translation-456', cardId: cardId }];
        const updatedMeanings = [{ dictionaryCardId: cardId, meaning: 'updated trial', dictionaryMeaningId: 'meaning-456', cardId: cardId }];
        const updatedExamples = [{ dictionaryCardId: cardId, example: 'This is an updated test', exampleId: 'example-789', translation: 'обновленный тест', cardId: cardId }];
        const result = yield cardModel.updateCard(cardId, updatedCard, updatedTranslations, updatedMeanings, updatedExamples);
        expect(result).toBe(true);
    }));
    test('addTagToCard should return true if tag added', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rowCount: 1, command: 'INSERT', oid: 0, fields: [], rows: [] });
        const result = yield cardTagModel.addTagToCard('card-123', 'tag-456');
        expect(result).toBe(true);
    }));
    test('removeTagFromCard should return true if tag removed', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rowCount: 1, command: 'DELETE', oid: 0, fields: [], rows: [] });
        const result = yield cardTagModel.removeTagFromCard('card-123', 'tag-456');
        expect(result).toBe(true);
    }));
    test('getTagsForCard should return an array of tag names', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rows: [{ name: tags[0].name }, { name: tags[1].name }], rowCount: 2, command: 'INSERT', oid: 0, fields: [] });
        const result = yield cardTagModel.getTagsForCard(cardId);
        expect(result).toEqual([tags[0].name, tags[1].name]);
    }));
});
