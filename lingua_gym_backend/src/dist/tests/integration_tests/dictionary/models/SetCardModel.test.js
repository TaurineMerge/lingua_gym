var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SetCardModel, DictionarySetModel, DictionaryCardModel } from '../../../../src/models/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { clearDatabase, closeDatabase, setupTestModelContainer } from '../../../utils/di/TestContainer.js';
import hash_password from '../../../../src/utils/hash/HashPassword.js';
import { UserModel } from '../../../../src/models/access_management/access_management.js';
let setCardModel;
let setModel;
let cardModel;
let userModel;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    const modelContainer = yield setupTestModelContainer();
    setCardModel = modelContainer.resolve(SetCardModel);
    setModel = modelContainer.resolve(DictionarySetModel);
    cardModel = modelContainer.resolve(DictionaryCardModel);
    userModel = modelContainer.resolve(UserModel);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    yield closeDatabase();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
}));
const createUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const userId = uuidv4();
    const userName = `Test User ${Math.random().toString(36).substring(2, 8)}`;
    const passwrod = 'password123';
    const user = {
        userId: userId,
        username: userName,
        displayName: userName,
        passwordHash: hash_password(passwrod),
        email: `${userName}@example.com`,
        tokenVersion: 0,
        profilePicture: 'photo.png',
        emailVerified: false
    };
    yield userModel.createUser(user);
    return userId;
});
const createSet = () => __awaiter(void 0, void 0, void 0, function* () {
    const setId = uuidv4();
    const ownerId = yield createUser();
    const setName = 'Test Set';
    const description = 'Set for testing';
    const set = {
        dictionarySetId: setId,
        name: setName,
        ownerId: ownerId,
        description: description,
        isPublic: false,
        languageCode: 'en',
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
        cardId: cardId,
        original: original,
        transcription: transcription,
        pronunciation: pronunciation
    };
    const translations = [
        {
            cardId: cardId,
            translation: translation,
            translationId: uuidv4()
        }
    ];
    const meanings = [
        {
            cardId: cardId,
            meaning: meaning,
            dictionaryMeaningId: uuidv4()
        }
    ];
    const examples = [
        {
            cardId: cardId,
            example: example,
            exampleId: uuidv4(),
            translation: translation
        }
    ];
    yield cardModel.createCard(card, translations, meanings, examples);
    return cardId;
});
describe('SetCardsModel integration', () => {
    test('addCardToSet should add card to set', () => __awaiter(void 0, void 0, void 0, function* () {
        const setId = yield createSet();
        const cardId = yield createCard();
        const result = (yield setCardModel.addCardToSet(setId, cardId));
        expect(result).not.toBeNull();
        expect(result.cardId).toBe(cardId);
        expect(result.setId).toBe(setId);
    }));
    test('removeCardFromSet should remove card from set', () => __awaiter(void 0, void 0, void 0, function* () {
        const setId = yield createSet();
        const cardId = yield createCard();
        yield setCardModel.addCardToSet(setId, cardId);
        const removed = yield setCardModel.removeCardFromSet(setId, cardId);
        expect(removed).not.toBeNull();
        expect(removed.cardId).toBe(cardId);
        const cards = yield setCardModel.getCardsBySet(setId);
        expect(cards).toBeNull();
    }));
    test('removeCardFromSet should return null if card not linked', () => __awaiter(void 0, void 0, void 0, function* () {
        const setId = yield createSet();
        const cardId = yield createCard();
        const removed = yield setCardModel.removeCardFromSet(setId, cardId);
        expect(removed).toBeNull();
    }));
    test('getCardsBySet should return all cards in set', () => __awaiter(void 0, void 0, void 0, function* () {
        const setId = yield createSet();
        const cardId1 = yield createCard();
        const cardId2 = yield createCard();
        yield setCardModel.addCardToSet(setId, cardId1);
        yield setCardModel.addCardToSet(setId, cardId2);
        const cards = yield setCardModel.getCardsBySet(setId);
        expect(cards).not.toBeNull();
        expect(cards.length).toBe(2);
        const cardIds = cards.map(c => c.cardId);
        expect(cardIds).toContain(cardId1);
        expect(cardIds).toContain(cardId2);
    }));
    test('getCardsBySet should return null if no cards linked', () => __awaiter(void 0, void 0, void 0, function* () {
        const setId = yield createSet();
        const result = yield setCardModel.getCardsBySet(setId);
        expect(result).toBeNull();
    }));
});
