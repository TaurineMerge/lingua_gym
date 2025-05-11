import { DictionaryCardModel } from '../../../../src/repositories/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { DictionaryCard, CardTranslation, CardMeaning, CardExample } from '../../../../src/database/interfaces/DbInterfaces.js';
import { TagModel, CardTagModel } from '../../../../src/repositories/tag/tag.js';
import { clearDatabase, closeDatabase, setupTestModelContainer } from '../../../utils/di/TestContainer.js';

describe('DictionaryCardModel integration', () => {
    let cardModel: DictionaryCardModel;
    let cardTagModel: CardTagModel;
    let tagModel: TagModel;
    let testCardId: string;
    let testTagId: string;

    const createTestCard = (): DictionaryCard => ({
        cardId: uuidv4(),
        original: 'testWord',
        transcription: '/tɛst/',
        pronunciation: 'https://example.com/pronunciation.mp3',
    });

    const createTestTranslations = (cardId: string): CardTranslation[] => 
        [{ cardId: cardId, translation: 'тест', translationId: uuidv4() }];

    const createTestTag = async () => {
        testTagId = await tagModel.createTag(uuidv4(), 'vocab') as string;
        return testTagId;
    };

    beforeAll(async () => {
        await clearDatabase();

        const modelContainer = await setupTestModelContainer();

        cardModel = modelContainer.resolve(DictionaryCardModel);
        cardTagModel = modelContainer.resolve(CardTagModel);
        tagModel = modelContainer.resolve(TagModel);
    });

    beforeEach(async () => {
        const card = createTestCard();
        const translations = createTestTranslations(card.cardId);
        const meanings: CardMeaning[] = [{ cardId: card.cardId, meaning: 'испытание', dictionaryMeaningId: uuidv4() }];
        const examples: CardExample[] = [{ cardId: card.cardId, example: 'This is a test sentence.', exampleId: uuidv4(), translation: 'тестовое предложение' }];

        testCardId = await cardModel.createCard(card, translations, meanings, examples);
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await clearDatabase();
        await closeDatabase();
    });

    test('should create and retrieve card with all related data', async () => {
        const result = await cardModel.getCardById(testCardId);
        expect(result?.original).toBe('testWord');
        expect(result?.translation).toContain('тест');
        expect(result?.meaning).toContain('испытание');
        expect(result?.example).toContain('This is a test sentence.');
    });

    test('should update card data completely', async () => {
        const updatedData: Partial<DictionaryCard> = { original: 'updatedWord' };
        const updatedTranslations: CardTranslation[] = [{ cardId: testCardId, translation: 'обновление', translationId: uuidv4() }];
        const updatedMeanings: CardMeaning[] = [{ cardId: testCardId, meaning: 'обновлённое значение', dictionaryMeaningId: uuidv4() }];
        const updatedExamples: CardExample[] = [{ cardId: testCardId, example: 'Updated example', exampleId: uuidv4(), translation: 'обновленное предложение' }];

        const isUpdated = await cardModel.updateCard(
            testCardId as string, 
            updatedData, 
            updatedTranslations, 
            updatedMeanings, 
            updatedExamples
        );
        expect(isUpdated).toBe(true);

        const result = await cardModel.getCardById(testCardId);
        expect(result?.original).toBe('updatedWord');
        expect(result?.translation).toContain('обновление');
    });

    describe('Tag operations', () => {
        beforeEach(async () => {
            testTagId = await createTestTag();
        });

        test('should associate tag with card', async () => {
            const isAdded = await cardTagModel.addTagToCard(testCardId, testTagId);
            expect(isAdded).toBe(true);

            const tags = await cardTagModel.getTagsForCard(testCardId);
            expect(tags).toContain('vocab');
        });

        test('should detach tag from card', async () => {
            await cardTagModel.addTagToCard(testCardId, testTagId);
            const isRemoved = await cardTagModel.removeTagFromCard(testCardId, testTagId);
            expect(isRemoved).toBe(true);

            const tags = await cardTagModel.getTagsForCard(testCardId);
            expect(tags).not.toContain('vocab');
        });
    });

    test('should completely remove card with all related data', async () => {
        const isRemoved = await cardModel.removeCardById(testCardId);
        expect(isRemoved).toBe(true);

        const result = await cardModel.getCardById(testCardId);
        expect(result).toBeNull();
    });
});