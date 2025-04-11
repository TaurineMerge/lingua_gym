import { setupTestServiceContainer, clearDatabase, closeDatabase } from '../../../utils/di/TestContainer.js';
import { DictionarySetModel, DictionaryCardModel } from '../../../../src/models/dictionary/dictionary.js';
import { SetCardService } from '../../../../src/services/dictionary/dictionary.js';
import { DictionarySet, DictionaryCard, User } from '../../../../src/database/interfaces/DbInterfaces.js';
import { v4 as uuidv4 } from 'uuid';
import { RegistrationService } from '../../../../src/services/access_management/access_management.js';

let setCardService: SetCardService;
let setModel: DictionarySetModel;
let cardModel: DictionaryCardModel;
let registrationService: RegistrationService;

beforeAll(async () => {
  await clearDatabase();

  const serviceContainer = await setupTestServiceContainer();
  setModel = serviceContainer.resolve(DictionarySetModel);
  cardModel = serviceContainer.resolve(DictionaryCardModel);
  setCardService = serviceContainer.resolve(SetCardService);

  registrationService = serviceContainer.resolve(RegistrationService);
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

describe('SetCardService', () => {
  let testSet: DictionarySet;
  let testCard: DictionaryCard;
  let testUser: Partial<User>;

  beforeEach(async () => {
    const testSetId = uuidv4();
    const testCardId = uuidv4();
  
    testUser = {
      userId: '',
      username: 'testuser',
      displayName: 'Test User',
      email: 'test@example.com',
    }

    testSet = {
      dictionarySetId: testSetId,
      name: 'Test Set',
      description: 'A test set of cards',
      ownerId: '',
      isPublic: true,
      languageCode: 'en',
    };
  
    testCard = {
      cardId: testCardId,
      original: 'Test Card',
      transcription: '/tɛst/',
      pronunciation: 'https://example.com/pronunciation.mp3',
    };

    const userId = (await registrationService.register(testUser.username as string, testUser.email as string, 'password123', testUser.displayName)).userId;
    testSet.ownerId = userId as string;
    testUser.userId = userId;
  })

  test('should add card to set', async () => {
    await setModel.createSet(testSet);
    await cardModel.createCard(testCard, [], [], []);

    const added = await setCardService.addCardToSet(testSet.dictionarySetId, testCard.cardId);
    expect(added).not.toBe(false);
    if (added !== false && added !== true) {
      expect(added.setId).toBe(testSet.dictionarySetId);
      expect(added.cardId).toBe(testCard.cardId);
    }
  });

  test('should return cards in set', async () => {
    await setModel.createSet(testSet);
    await cardModel.createCard(testCard, [], [], []);
    await setCardService.addCardToSet(testSet.dictionarySetId, testCard.cardId);

    const cards = await setCardService.getCardsForSet(testSet.dictionarySetId);
    expect(cards.length).toBe(1);
    expect(cards[0].cardId).toBe(testCard.cardId);
  });

  test('should remove card from set', async () => {
    await setModel.createSet(testSet);
    await cardModel.createCard(testCard, [], [], []);
    await setCardService.addCardToSet(testSet.dictionarySetId, testCard.cardId);

    const removed = await setCardService.removeCardFromSet(testSet.dictionarySetId, testCard.cardId);
    expect(removed).not.toBe(false);

    const cards = await setCardService.getCardsForSet(testSet.dictionarySetId);
    expect(cards).toBe(null);
  });

  test('should return false if adding card with missing IDs', async () => {
    const result = await setCardService.addCardToSet('', '');
    expect(result).toBe(false);
  });

  test('should return false if removing card with missing IDs', async () => {
    const result = await setCardService.removeCardFromSet('', '');
    expect(result).toBe(false);
  });

  test('should return empty array if getting cards with empty setId', async () => {
    const result = await setCardService.getCardsForSet('');
    expect(result).toEqual([]);
  });
});