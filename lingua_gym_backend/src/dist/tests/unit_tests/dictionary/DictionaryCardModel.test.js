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
describe('DictionaryCardModel', () => {
    let dbMock;
    let cardModel;
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
    });
    test('createCard should insert card and return ID', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query
            .mockResolvedValueOnce({ rows: [{ dictionaryCardId: cardId }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield cardModel.createCard(card, cardTranslations, cardMeanings, cardExamples);
        expect(dbMock.query).toHaveBeenCalledTimes(5);
        expect(result).toBe(cardId);
    }));
    test('removeCardById should delete a card and return true', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rows: [{ dictionaryCardId: cardId }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield cardModel.removeCardById(cardId);
        expect(dbMock.query).toHaveBeenCalledTimes(5);
        expect(result).toBe(true);
    }));
    test('removeCardById should return false if no card was deleted', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rows: [], rowCount: 0, command: 'INSERT', oid: 0, fields: [] });
        const result = yield cardModel.removeCardById(cardId);
        expect(result).toBe(false);
    }));
    test('getCardById should return card details', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query
            .mockResolvedValueOnce({ rows: [{ dictionary_card_id: cardId, original: cardName }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValueOnce({ rows: [{ translation: cardTranslations[0].translation }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValueOnce({ rows: [{ meaning: cardMeanings[0].meaning }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] })
            .mockResolvedValueOnce({ rows: [{ example: cardExamples[0].example }], rowCount: 1, command: 'INSERT', oid: 0, fields: [] });
        const result = yield cardModel.getCardById(cardId);
        expect(result).toEqual({
            dictionaryCardId: cardId,
            original: cardName,
            translations: [{ translation: cardTranslations[0].translation }],
            meanings: [{ meaning: cardMeanings[0].meaning }],
            examples: [{ example: cardExamples[0].example }],
        });
    }));
    test('addTagToCard should return true if tag added', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rowCount: 1, command: 'INSERT', oid: 0, fields: [], rows: [] });
        const result = yield cardModel.addTagToCard('card-123', 'tag-456');
        expect(result).toBe(true);
    }));
    test('removeTagFromCard should return true if tag removed', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rowCount: 1, command: 'INSERT', oid: 0, fields: [], rows: [] });
        const result = yield cardModel.removeTagFromCard('card-123', 'tag-456');
        expect(result).toBe(true);
    }));
    test('getTagsForCard should return an array of tag names', () => __awaiter(void 0, void 0, void 0, function* () {
        dbMock.query.mockResolvedValueOnce({ rows: [{ name: tags[0].name }, { name: tags[1].name }], rowCount: 2, command: 'INSERT', oid: 0, fields: [] });
        const result = yield cardModel.getTagsForCard(cardId);
        expect(result).toEqual([tags[0].name, tags[1].name]);
    }));
});
