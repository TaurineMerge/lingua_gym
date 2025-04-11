import { DictionaryCardService } from '../../../../src/services/dictionary/dictionary.js';
import { setupTestServiceContainer, clearDatabase, closeDatabase } from '../../../utils/di/TestContainer.js';
import { DictionaryCard, CardTranslation, CardMeaning, CardExample } from '../../../../src/database/interfaces/DbInterfaces.js';
import { v4 as uuidv4 } from 'uuid';

let service: DictionaryCardService;

beforeAll(async () => {
  const serviceContainer = await setupTestServiceContainer();
  service = serviceContainer.resolve(DictionaryCardService);
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

describe('DictionaryCardService', () => {
  const card: DictionaryCard = {
    cardId: uuidv4(),
    original: 'run',
    transcription: '/rʌn/',
    pronunciation: 'https://example.com/pronunciation/run.mp3',
  };

  const translations: CardTranslation[] = [
    { cardId: 'test-card-1', translation: 'run', translationId: uuidv4() },
  ];

  const meanings: CardMeaning[] = [
    { cardId: 'test-card-1', meaning: 'to run', dictionaryMeaningId: uuidv4() },
  ];

  const examples: CardExample[] = [
    { cardId: 'test-card-1', example: 'I run.', exampleId: uuidv4(), translation: 'я бегаю' },
  ];

  test('should create a new card with translations, meanings, and examples', async () => {
    const result = await service.createCard(card, translations, meanings, examples);
    expect(result).toBe(card.cardId);
  });

  test('should return the created card by ID', async () => {
    await service.createCard(card, translations, meanings, examples);
    const fetchedCard = await service.getCardById(card.cardId);
    expect(fetchedCard).not.toBeNull();
    expect(fetchedCard?.original).toBe('run');
  });

  test('should remove a card by ID', async () => {
    await service.createCard(card, translations, meanings, examples);
    const deleted = await service.removeCardById(card.cardId);
    expect(deleted).toBe(true);

    const afterDelete = await service.getCardById(card.cardId);
    expect(afterDelete).toBeNull();
  });

  test('should return null when creating card with invalid data', async () => {
    const badCard = { ...card, cardId: '', original: '' };
    const result = await service.createCard(badCard, translations, meanings, examples);
    expect(result).toBeNull();
  });

  test('should return null for getCardById if ID is not provided', async () => {
    const result = await service.getCardById('');
    expect(result).toBeNull();
  });

  test('should return false for removeCardById if ID is not provided', async () => {
    const result = await service.removeCardById('');
    expect(result).toBe(false);
  });
});
