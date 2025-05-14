var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setupTestServiceContainer, clearDatabase, closeDatabase } from '../../../utils/di/TestContainer.js';
import { DictionarySetRepository, DictionaryCardRepository } from '../../../../src/repositories/dictionary/dictionary.js';
import { SetCardService } from '../../../../src/services/dictionary/dictionary.js';
import { LanguageCode } from '../../../../src/database/interfaces/DbInterfaces.js';
import { v4 as uuidv4 } from 'uuid';
import { RegistrationService } from '../../../../src/services/access_management/access_management.js';
let setCardService;
let setModel;
let cardModel;
let registrationService;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    const serviceContainer = yield setupTestServiceContainer();
    setModel = serviceContainer.resolve(DictionarySetRepository);
    cardModel = serviceContainer.resolve(DictionaryCardRepository);
    setCardService = serviceContainer.resolve(SetCardService);
    registrationService = serviceContainer.resolve(RegistrationService);
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    yield closeDatabase();
}));
describe('SetCardService', () => {
    let testSet;
    let testCard;
    let testUser;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const testSetId = uuidv4();
        const testCardId = uuidv4();
        testUser = {
            userId: '',
            username: 'testuser',
            displayName: 'Test User',
            email: 'test@example.com',
        };
        testSet = {
            dictionarySetId: testSetId,
            name: 'Test Set',
            description: 'A test set of cards',
            ownerId: '',
            isPublic: true,
            languageCode: LanguageCode.ENGLISH,
        };
        testCard = {
            cardId: testCardId,
            original: 'Test Card',
            transcription: '/tɛst/',
            pronunciation: 'https://example.com/pronunciation.mp3',
        };
        const userId = (yield registrationService.register(testUser.username, testUser.email, 'password123', testUser.displayName)).userId;
        testSet.ownerId = userId;
        testUser.userId = userId;
    }));
    test('should add card to set', () => __awaiter(void 0, void 0, void 0, function* () {
        yield setModel.createSet(testSet);
        yield cardModel.createCard(Object.assign(Object.assign({}, testCard), { translations: [], meanings: [], examples: [] }));
        const added = yield setCardService.addCardToSet(testSet.dictionarySetId, testCard.cardId);
        expect(added).not.toBe(false);
        if (added !== false && added !== true) {
            expect(added.setId).toBe(testSet.dictionarySetId);
            expect(added.cardId).toBe(testCard.cardId);
        }
    }));
    test('should return cards in set', () => __awaiter(void 0, void 0, void 0, function* () {
        yield setModel.createSet(testSet);
        yield cardModel.createCard(Object.assign(Object.assign({}, testCard), { translations: [], meanings: [], examples: [] }));
        yield setCardService.addCardToSet(testSet.dictionarySetId, testCard.cardId);
        const cards = yield setCardService.getCardsForSet(testSet.dictionarySetId);
        expect(cards.length).toBe(1);
        expect(cards[0].cardId).toBe(testCard.cardId);
    }));
    test('should remove card from set', () => __awaiter(void 0, void 0, void 0, function* () {
        yield setModel.createSet(testSet);
        yield cardModel.createCard(Object.assign(Object.assign({}, testCard), { translations: [], meanings: [], examples: [] }));
        yield setCardService.addCardToSet(testSet.dictionarySetId, testCard.cardId);
        const removed = yield setCardService.removeCardFromSet(testSet.dictionarySetId, testCard.cardId);
        expect(removed).not.toBe(false);
        const cards = yield setCardService.getCardsForSet(testSet.dictionarySetId);
        expect(cards).toBe(null);
    }));
    test('should return false if adding card with missing IDs', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield setCardService.addCardToSet('', '');
        expect(result).toBe(false);
    }));
    test('should return false if removing card with missing IDs', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield setCardService.removeCardFromSet('', '');
        expect(result).toBe(false);
    }));
    test('should return empty array if getting cards with empty setId', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield setCardService.getCardsForSet('');
        expect(result).toEqual([]);
    }));
});
