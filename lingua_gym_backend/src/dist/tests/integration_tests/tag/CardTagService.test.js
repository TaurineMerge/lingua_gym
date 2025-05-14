var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setupTestModelContainer, setupTestServiceContainer, clearDatabase, closeDatabase } from '../../utils/di/TestContainer.js';
import { TagModel } from '../../../src/repositories/tag/tag.js';
import CardTagService from '../../../src/services/tag/CardTagService.js';
import { DictionaryCardModel } from '../../../src/repositories/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
let cardTagService;
let tagModel;
let cardModel;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    const modelContainer = yield setupTestModelContainer();
    tagModel = modelContainer.resolve(TagModel);
    cardModel = modelContainer.resolve(DictionaryCardModel);
    const serviceContainer = yield setupTestServiceContainer();
    cardTagService = serviceContainer.resolve(CardTagService);
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    yield closeDatabase();
}));
const createCardData = () => __awaiter(void 0, void 0, void 0, function* () {
    const cardId = uuidv4();
    const card = {
        cardId: cardId,
        original: 'cat',
        transcription: '/kæt/',
        pronunciation: 'https://example.com/pronunciation/cat.mp3'
    };
    const translations = [
        {
            cardId: cardId,
            translation: 'кот',
            translationId: uuidv4()
        },
        {
            cardId: cardId,
            translation: 'кошка',
            translationId: uuidv4()
        }
    ];
    const meanings = [
        {
            cardId: cardId,
            meaning: 'domestic furry animal',
            dictionaryMeaningId: uuidv4()
        }
    ];
    const examples = [
        {
            cardId: cardId,
            example: 'I have two dogs and a cat',
            exampleId: uuidv4(),
            translation: 'у меня есть два собаки и кошка'
        }
    ];
    return Object.assign(Object.assign({}, card), { translations, meanings, examples });
});
describe('CardTagService', () => {
    test('should add a tag to a card', () => __awaiter(void 0, void 0, void 0, function* () {
        const card = yield createCardData();
        const tagId = uuidv4();
        yield cardModel.createCard(card, card.translations, card.meanings, card.examples);
        yield tagModel.createTag(tagId, 'Animals');
        const result = yield cardTagService.addTagToCard(card.cardId, tagId);
        expect(result).toBe(true);
    }));
    test('should not add tag to card if cardId or tagId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield cardTagService.addTagToCard('', '');
        expect(result).toBe(false);
    }));
    test('should remove a tag from a card', () => __awaiter(void 0, void 0, void 0, function* () {
        const card = yield createCardData();
        const tagId = uuidv4();
        yield cardModel.createCard(card, card.translations, card.meanings, card.examples);
        yield tagModel.createTag(tagId, 'Pets');
        yield cardTagService.addTagToCard(card.cardId, tagId);
        const result = yield cardTagService.removeTagFromCard(card.cardId, tagId);
        expect(result).toBe(true);
    }));
    test('should not remove tag if cardId or tagId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield cardTagService.removeTagFromCard('', '');
        expect(result).toBe(false);
    }));
    test('should get tags for a card', () => __awaiter(void 0, void 0, void 0, function* () {
        const card = yield createCardData();
        const tagId1 = uuidv4();
        const tagId2 = uuidv4();
        yield cardModel.createCard(card, card.translations, card.meanings, card.examples);
        yield tagModel.createTag(tagId1, 'Pets');
        yield tagModel.createTag(tagId2, 'Animals');
        yield cardTagService.addTagToCard(card.cardId, tagId1);
        yield cardTagService.addTagToCard(card.cardId, tagId2);
        const tags = (yield cardTagService.getTagsForCard(card.cardId)).map(tag => tag.tagId);
        expect(tags).toEqual(expect.arrayContaining([tagId1, tagId2]));
    }));
    test('should return empty array if cardId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const tags = yield cardTagService.getTagsForCard('');
        expect(tags).toEqual([]);
    }));
});
