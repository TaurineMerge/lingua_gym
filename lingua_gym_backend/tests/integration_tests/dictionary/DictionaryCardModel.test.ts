import Database from '../../../src/database/config/db-connection.js';
import { DictionaryCardModel } from '../../../src/models/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { DictionaryCard, CardTranslation, CardMeaning, CardExample } from '../../../src/database/interfaces/DbInterfaces.js';
import { TagModel } from '../../../src/models/tag/tag.js';

describe('DictionaryCardModel integration', () => {
    let db: Database;
    let cardModel: DictionaryCardModel;
    let tagModel: TagModel;
    let testCardId: string;
    let testTagId: string;

    const createTestCard = (): DictionaryCard => ({
        dictionaryCardId: uuidv4(),
        original: 'testWord',
        transcription: '/tɛst/',
        pronunciation: 'test',
    });

    const createTestTranslations = (cardId: string): CardTranslation[] => 
        [{ dictionaryCardId: cardId, translation: 'тест' }];

    const createTestTag = async () => {
        testTagId = await tagModel.createTag(uuidv4(), 'vocab') as string;
        return testTagId;
    };

    beforeAll(async () => {
        db = Database.getInstance();
        cardModel = new DictionaryCardModel(db);
        tagModel = new TagModel(db);
    });

    beforeEach(async () => {
        const card = createTestCard();
        const translations = createTestTranslations(card.dictionaryCardId);
        const meanings: CardMeaning[] = [{ dictionaryCardId: card.dictionaryCardId, meaning: 'испытание' }];
        const examples: CardExample[] = [{ dictionaryCardId: card.dictionaryCardId, example: 'This is a test sentence.' }];

        testCardId = await cardModel.createCard(card, translations, meanings, examples);
    });

    afterEach(async () => {
        if (testCardId) {
            await cardModel.removeCardById(testCardId).catch(() => {});
        }
        if (testTagId) {
            await tagModel.deleteTag(testTagId).catch(() => {});
        }
    });

    afterAll(async () => {
        await db.close();
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
        const updatedTranslations: CardTranslation[] = [{ dictionaryCardId: testCardId, translation: 'обновление' }];
        const updatedMeanings: CardMeaning[] = [{ dictionaryCardId: testCardId, meaning: 'обновлённое значение' }];
        const updatedExamples: CardExample[] = [{ dictionaryCardId: testCardId, example: 'Updated example' }];

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
            const added = await cardModel.addTagToCard(testCardId, testTagId);
            expect(added).toBe(true);

            const tags = await cardModel.getTagsForCard(testCardId);
            expect(tags).toContain('vocab');
        });

        test('should detach tag from card', async () => {
            await cardModel.addTagToCard(testCardId, testTagId);
            const isRemoved = await cardModel.removeTagFromCard(testCardId, testTagId);
            expect(isRemoved).toBe(true);

            const tags = await cardModel.getTagsForCard(testCardId);
            expect(tags).not.toContain('vocab');
        });
    });

    test('should completely remove card with all related data', async () => {
        const removed = await cardModel.removeCardById(testCardId);
        expect(removed).toBe(true);

        const result = await cardModel.getCardById(testCardId);
        expect(result).toBeNull();
    });
});