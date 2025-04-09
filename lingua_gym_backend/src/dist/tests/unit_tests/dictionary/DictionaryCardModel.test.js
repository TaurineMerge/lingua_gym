var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DictionaryCardModel } from '../../../src/models/dictionary/dictionary.js';
import { CardTagsModel } from '../../../src/models/tag/tag.js';
describe('DictionaryCardModel', () => {
    let dbMock;
    let cardModel;
    let cardTagsModel;
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
            dictionaryCardId: cardId,
            original: cardName,
            transcription: cardTranscription,
            pronunciation: cardPronunciation,
        };
        cardTranslations = [{ dictionaryCardId: cardId, translation: 'тест' }];
        cardMeanings = [{ dictionaryCardId: cardId, meaning: 'a trial' }];
        cardExamples = [{ dictionaryCardId: cardId, example: 'This is a test' }, { dictionaryCardId: cardId, example: 'This is another test' }];
    });
    beforeEach(() => {
        dbMock = {
            query: jest.fn(),
        };
        cardModel = new DictionaryCardModel(dbMock);
        cardTagsModel = new CardTagsModel(dbMock);
    });
    test('createCard should insert card and return ID', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query
            .mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValueOnce({ rows: [{ dictionaryCardId: cardId }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] })
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
        const updatedTranslations = [{ dictionaryCardId: cardId, translation: 'обновленный тест' }];
        const updatedMeanings = [{ dictionaryCardId: cardId, meaning: 'updated trial' }];
        const updatedExamples = [{ dictionaryCardId: cardId, example: 'This is an updated test' }];
        const result = yield cardModel.updateCard(cardId, updatedCard, updatedTranslations, updatedMeanings, updatedExamples);
        expect(result).toBe(true);
    }));
    test('addTagToCard should return true if tag added', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rowCount: 1, command: 'INSERT', oid: 0, fields: [], rows: [] });
        const result = yield cardTagsModel.addTagToCard('card-123', 'tag-456');
        expect(result).toBe(true);
    }));
    test('removeTagFromCard should return true if tag removed', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rowCount: 1, command: 'DELETE', oid: 0, fields: [], rows: [] });
        const result = yield cardTagsModel.removeTagFromCard('card-123', 'tag-456');
        expect(result).toBe(true);
    }));
    test('getTagsForCard should return an array of tag names', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rows: [{ name: tags[0].name }, { name: tags[1].name }], rowCount: 2, command: 'INSERT', oid: 0, fields: [] });
        const result = yield cardTagsModel.getTagsForCard(cardId);
        expect(result).toEqual([tags[0].name, tags[1].name]);
    }));
});
