var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DictionaryCardService } from '../../../../src/services/dictionary/dictionary.js';
import { setupTestServiceContainer, clearDatabase, closeDatabase } from '../../../utils/di/TestContainer.js';
import { v4 as uuidv4 } from 'uuid';
let service;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const serviceContainer = yield setupTestServiceContainer();
    service = serviceContainer.resolve(DictionaryCardService);
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    yield closeDatabase();
}));
describe('DictionaryCardService', () => {
    const card = {
        cardId: uuidv4(),
        original: 'run',
        transcription: '/rʌn/',
        pronunciation: 'https://example.com/pronunciation/run.mp3',
    };
    const translations = [
        { cardId: 'test-card-1', translation: 'run', translationId: uuidv4() },
    ];
    const meanings = [
        { cardId: 'test-card-1', meaning: 'to run', dictionaryMeaningId: uuidv4() },
    ];
    const examples = [
        { cardId: 'test-card-1', example: 'I run.', exampleId: uuidv4(), translation: 'я бегаю' },
    ];
    test('should create a new card with translations, meanings, and examples', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.createCard(card, translations, meanings, examples);
        expect(result).toBe(card.cardId);
    }));
    test('should return the created card by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield service.createCard(card, translations, meanings, examples);
        const fetchedCard = yield service.getCardById(card.cardId);
        expect(fetchedCard).not.toBeNull();
        expect(fetchedCard === null || fetchedCard === void 0 ? void 0 : fetchedCard.original).toBe('run');
    }));
    test('should remove a card by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield service.createCard(card, translations, meanings, examples);
        const deleted = yield service.removeCardById(card.cardId);
        expect(deleted).toBe(true);
        const afterDelete = yield service.getCardById(card.cardId);
        expect(afterDelete).toBeNull();
    }));
    test('should return null when creating card with invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
        const badCard = Object.assign(Object.assign({}, card), { cardId: '', original: '' });
        const result = yield service.createCard(badCard, translations, meanings, examples);
        expect(result).toBeNull();
    }));
    test('should return null for getCardById if ID is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.getCardById('');
        expect(result).toBeNull();
    }));
    test('should return false for removeCardById if ID is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield service.removeCardById('');
        expect(result).toBe(false);
    }));
});
