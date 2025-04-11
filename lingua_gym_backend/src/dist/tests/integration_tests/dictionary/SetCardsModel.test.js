var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Database from '../../../src/database/config/db-connection.js';
import { SetCardsModel, DictionarySetModel, DictionaryCardModel } from '../../../src/models/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
let db;
let setCardsModel;
let setModel;
let cardModel;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    db = Database.getInstance();
    setCardsModel = new SetCardsModel(db);
    setModel = new DictionarySetModel(db);
    cardModel = new DictionaryCardModel(db);
    yield clearDatabase();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield db.close();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
}));
const clearDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    yield db.query('DELETE FROM "SetCards"');
    yield db.query('DELETE FROM "DictionaryCards"');
    yield db.query('DELETE FROM "DictionarySets"');
});
const createSet = () => __awaiter(void 0, void 0, void 0, function* () {
    const setId = uuidv4();
    const ownerId = uuidv4();
    const setName = 'Test Set';
    const description = 'Set for testing';
    const set = {
        dictionarySetId: setId,
        name: setName,
        ownerId: ownerId,
        description: description,
        isPublic: false,
        createdAt: new Date(),
    };
    yield setModel.createSet(set);
    return setId;
});
const createCard = () => __awaiter(void 0, void 0, void 0, function* () {
    const cardId = uuidv4();
    const original = 'Test Card';
    const translation = 'Test Card Translation';
    const meaning = 'Test Card Meaning';
    const example = 'Test Card Example';
    const transcription = 'Test Card Transcription';
    const pronunciation = 'Test Card Pronunciation';
    const card = {
        dictionaryCardId: cardId,
        original: original,
        transcription: transcription,
        pronunciation: pronunciation
    };
    const translations = [
        {
            dictionaryCardId: cardId,
            translation: translation
        }
    ];
    const meanings = [
        {
            dictionaryCardId: cardId,
            meaning: meaning
        }
    ];
    const examples = [
        {
            dictionaryCardId: cardId,
            example: example
        }
    ];
    yield cardModel.createCard(card, translations, meanings, examples);
    return cardId;
});
describe('SetCardsModel integration', () => {
    test('addCardToSet should add card to set', () => __awaiter(void 0, void 0, void 0, function* () {
        const setId = yield createSet();
        const cardId = yield createCard();
        const result = (yield setCardsModel.addCardToSet(setId, cardId));
        expect(result).not.toBeNull();
        expect(result.cardId).toBe(cardId);
        expect(result.setId).toBe(setId);
    }));
    test('removeCardFromSet should remove card from set', () => __awaiter(void 0, void 0, void 0, function* () {
        const setId = yield createSet();
        const cardId = yield createCard();
        yield setCardsModel.addCardToSet(setId, cardId);
        const removed = yield setCardsModel.removeCardFromSet(setId, cardId);
        expect(removed).not.toBeNull();
        expect(removed.cardId).toBe(cardId);
        const cards = yield setCardsModel.getCardsBySet(setId);
        expect(cards).toBeNull();
    }));
    test('removeCardFromSet should return null if card not linked', () => __awaiter(void 0, void 0, void 0, function* () {
        const setId = yield createSet();
        const cardId = yield createCard();
        const removed = yield setCardsModel.removeCardFromSet(setId, cardId);
        expect(removed).toBeNull();
    }));
    test('getCardsBySet should return all cards in set', () => __awaiter(void 0, void 0, void 0, function* () {
        const setId = yield createSet();
        const cardId1 = yield createCard();
        const cardId2 = yield createCard();
        yield setCardsModel.addCardToSet(setId, cardId1);
        yield setCardsModel.addCardToSet(setId, cardId2);
        const cards = yield setCardsModel.getCardsBySet(setId);
        expect(cards).not.toBeNull();
        expect(cards.length).toBe(2);
        const cardIds = cards.map(c => c.dictionaryCardId);
        expect(cardIds).toContain(cardId1);
        expect(cardIds).toContain(cardId2);
    }));
    test('getCardsBySet should return null if no cards linked', () => __awaiter(void 0, void 0, void 0, function* () {
        const setId = yield createSet();
        const result = yield setCardsModel.getCardsBySet(setId);
        expect(result).toBeNull();
    }));
});
