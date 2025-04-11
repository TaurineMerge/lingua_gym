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
import { DictionaryCardModel } from '../../../src/models/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { TagModel, CardTagsModel } from '../../../src/models/tag/tag.js';
describe('DictionaryCardModel integration', () => {
    let db;
    let cardModel;
    let cardTagsModel;
    let tagModel;
    let testCardId;
    let testTagId;
    const createTestCard = () => ({
        dictionaryCardId: uuidv4(),
        original: 'testWord',
        transcription: '/tɛst/',
        pronunciation: 'test',
    });
    const createTestTranslations = (cardId) => [{ dictionaryCardId: cardId, translation: 'тест' }];
    const createTestTag = () => __awaiter(void 0, void 0, void 0, function* () {
        testTagId = (yield tagModel.createTag(uuidv4(), 'vocab'));
        return testTagId;
    });
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        db = Database.getInstance();
        cardModel = new DictionaryCardModel(db);
        tagModel = new TagModel(db);
        cardTagsModel = new CardTagsModel(db);
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        const card = createTestCard();
        const translations = createTestTranslations(card.dictionaryCardId);
        const meanings = [{ dictionaryCardId: card.dictionaryCardId, meaning: 'испытание' }];
        const examples = [{ dictionaryCardId: card.dictionaryCardId, example: 'This is a test sentence.' }];
        testCardId = yield cardModel.createCard(card, translations, meanings, examples);
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        if (testCardId) {
            yield cardModel.removeCardById(testCardId).catch(() => { });
        }
        if (testTagId) {
            yield tagModel.deleteTag(testTagId).catch(() => { });
        }
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.close();
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
        const updatedTranslations = [{ dictionaryCardId: testCardId, translation: 'обновление' }];
        const updatedMeanings = [{ dictionaryCardId: testCardId, meaning: 'обновлённое значение' }];
        const updatedExamples = [{ dictionaryCardId: testCardId, example: 'Updated example' }];
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
            const added = yield cardTagsModel.addTagToCard(testCardId, testTagId);
            expect(added).toBe(true);
            const tags = yield cardTagsModel.getTagsForCard(testCardId);
            expect(tags).toContain('vocab');
        }));
        test('should detach tag from card', () => __awaiter(void 0, void 0, void 0, function* () {
            yield cardTagsModel.addTagToCard(testCardId, testTagId);
            const isRemoved = yield cardTagsModel.removeTagFromCard(testCardId, testTagId);
            expect(isRemoved).toBe(true);
            const tags = yield cardTagsModel.getTagsForCard(testCardId);
            expect(tags).not.toContain('vocab');
        }));
    });
    test('should completely remove card with all related data', () => __awaiter(void 0, void 0, void 0, function* () {
        const removed = yield cardModel.removeCardById(testCardId);
        expect(removed).toBe(true);
        const result = yield cardModel.getCardById(testCardId);
        expect(result).toBeNull();
    }));
});
