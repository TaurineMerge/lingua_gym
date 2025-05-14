import { DictionaryCardRepository } from '../../../../src/repositories/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { IDictionaryCard, ICardTranslation, ICardMeaning, ICardExample } from '../../../../src/database/interfaces/DbInterfaces.js';
import { clearDatabase, closeDatabase, setupTestRepositoryContainer } from '../../../utils/di/TestContainer.js';

describe('DictionaryCardModel integration', () => {
    let cardRepository: DictionaryCardRepository;
    let testCardId: string;

    const createTestCard = (): IDictionaryCard => ({
        cardId: uuidv4(),
        original: 'testWord',
        transcription: '/tɛst/',
        pronunciation: 'https://example.com/pronunciation.mp3',
    });

    const createTestTranslations = (cardId: string): ICardTranslation[] => 
        [{ cardId: cardId, translation: 'тест', translationId: uuidv4() }];

    beforeAll(async () => {
        await clearDatabase();

        const modelContainer = await setupTestRepositoryContainer();

        cardRepository = modelContainer.resolve(DictionaryCardRepository);
    });

    beforeEach(async () => {
        const card = createTestCard();
        const translations = createTestTranslations(card.cardId);
        const meanings: ICardMeaning[] = [{ cardId: card.cardId, meaning: 'испытание', dictionaryMeaningId: uuidv4() }];
        const examples: ICardExample[] = [{ cardId: card.cardId, example: 'This is a test sentence.', exampleId: uuidv4(), translation: 'тестовое предложение' }];

        testCardId = await cardRepository.createCard({ ...card, translations, meanings, examples });
    });

    afterEach(async () => {
        await clearDatabase();
    });

    afterAll(async () => {
        await clearDatabase();
        await closeDatabase();
    });

    test('should create and retrieve card with all related data', async () => {
        const result = await cardRepository.getCardById(testCardId);
        expect(result?.original).toBe('testWord');
        expect(result?.translation).toContain('тест');
        expect(result?.meaning).toContain('испытание');
        expect(result?.example).toContain('This is a test sentence.');
    });

    test('should update card data completely', async () => {
        const updatedData: Partial<IDictionaryCard> = { original: 'updatedWord' };
        const updatedTranslations: ICardTranslation[] = [{ cardId: testCardId, translation: 'обновление', translationId: uuidv4() }];
        const updatedMeanings: ICardMeaning[] = [{ cardId: testCardId, meaning: 'обновлённое значение', dictionaryMeaningId: uuidv4() }];
        const updatedExamples: ICardExample[] = [{ cardId: testCardId, example: 'Updated example', exampleId: uuidv4(), translation: 'обновленное предложение' }];

        const isUpdated = await cardRepository.updateCard(
            testCardId as string, 
            updatedData, 
            updatedTranslations, 
            updatedMeanings, 
            updatedExamples
        );
        expect(isUpdated).toBe(true);

        const result = await cardRepository.getCardById(testCardId);
        expect(result?.original).toBe('updatedWord');
        expect(result?.translation).toContain('обновление');
    });

    test('should completely remove card with all related data', async () => {
        const isRemoved = await cardRepository.removeCardById(testCardId);
        expect(isRemoved).toBe(true);

        const result = await cardRepository.getCardById(testCardId);
        expect(result).toBeNull();
    });
});