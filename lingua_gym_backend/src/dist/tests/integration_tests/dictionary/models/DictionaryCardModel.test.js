var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DictionaryCardModel } from '../../../../src/models/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { TagModel, CardTagModel } from '../../../../src/models/tag/tag.js';
import { clearDatabase, closeDatabase, setupTestModelContainer } from '../../../utils/di/TestContainer.js';
describe('DictionaryCardModel integration', () => {
    let cardModel;
    let cardTagModel;
    let tagModel;
    let testCardId;
    let testTagId;
    const createTestCard = () => ({
        cardId: uuidv4(),
        original: 'testWord',
        transcription: '/tɛst/',
        pronunciation: 'https://example.com/pronunciation.mp3',
    });
    const createTestTranslations = (cardId) => [{ cardId: cardId, translation: 'тест', translationId: uuidv4() }];
    const createTestTag = () => __awaiter(void 0, void 0, void 0, function* () {
        testTagId = (yield tagModel.createTag(uuidv4(), 'vocab'));
        return testTagId;
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearDatabase();
        const modelContainer = yield setupTestModelContainer();
        cardModel = modelContainer.resolve(DictionaryCardModel);
        cardTagModel = modelContainer.resolve(CardTagModel);
        tagModel = modelContainer.resolve(TagModel);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const card = createTestCard();
        const translations = createTestTranslations(card.cardId);
        const meanings = [{ cardId: card.cardId, meaning: 'испытание', dictionaryMeaningId: uuidv4() }];
        const examples = [{ cardId: card.cardId, example: 'This is a test sentence.', exampleId: uuidv4(), translation: 'тестовое предложение' }];
        testCardId = yield cardModel.createCard(card, translations, meanings, examples);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearDatabase();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield clearDatabase();
        yield closeDatabase();
    }));
    test('should create and retrieve card with all related data', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield cardModel.getCardById(testCardId);
        expect(result === null || result === void 0 ? void 0 : result.original).toBe('testWord');
        expect(result === null || result === void 0 ? void 0 : result.translation).toContain('тест');
        expect(result === null || result === void 0 ? void 0 : result.meaning).toContain('испытание');
        expect(result === null || result === void 0 ? void 0 : result.example).toContain('This is a test sentence.');
    }));
    test('should update card data completely', () => __awaiter(void 0, void 0, void 0, function* () {
        const updatedData = { original: 'updatedWord' };
        const updatedTranslations = [{ cardId: testCardId, translation: 'обновление', translationId: uuidv4() }];
        const updatedMeanings = [{ cardId: testCardId, meaning: 'обновлённое значение', dictionaryMeaningId: uuidv4() }];
        const updatedExamples = [{ cardId: testCardId, example: 'Updated example', exampleId: uuidv4(), translation: 'обновленное предложение' }];
        const isUpdated = yield cardModel.updateCard(testCardId, updatedData, updatedTranslations, updatedMeanings, updatedExamples);
        expect(isUpdated).toBe(true);
        const result = yield cardModel.getCardById(testCardId);
        expect(result === null || result === void 0 ? void 0 : result.original).toBe('updatedWord');
        expect(result === null || result === void 0 ? void 0 : result.translation).toContain('обновление');
    }));
    describe('Tag operations', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            testTagId = yield createTestTag();
        }));
        test('should associate tag with card', () => __awaiter(void 0, void 0, void 0, function* () {
            const isAdded = yield cardTagModel.addTagToCard(testCardId, testTagId);
            expect(isAdded).toBe(true);
            const tags = yield cardTagModel.getTagsForCard(testCardId);
            expect(tags).toContain('vocab');
        }));
        test('should detach tag from card', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cardTagModel.addTagToCard(testCardId, testTagId);
            const isRemoved = yield cardTagModel.removeTagFromCard(testCardId, testTagId);
            expect(isRemoved).toBe(true);
            const tags = yield cardTagModel.getTagsForCard(testCardId);
            expect(tags).not.toContain('vocab');
        }));
    });
    test('should completely remove card with all related data', () => __awaiter(void 0, void 0, void 0, function* () {
        const isRemoved = yield cardModel.removeCardById(testCardId);
        expect(isRemoved).toBe(true);
        const result = yield cardModel.getCardById(testCardId);
        expect(result).toBeNull();
    }));
});
