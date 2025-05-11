import { setupTestModelContainer, setupTestServiceContainer, clearDatabase, closeDatabase } from '../../utils/di/TestContainer.js';
import { TagModel } from '../../../src/repositories/tag/tag.js';
import CardTagService from '../../../src/services/tag/CardTagService.js';
import { DictionaryCardModel } from '../../../src/repositories/dictionary/dictionary.js';
import { v4 as uuidv4 } from 'uuid';
import { CardExample, CardMeaning, CardTranslation, DictionaryCard } from '../../../src/database/interfaces/DbInterfaces.js';

let cardTagService: CardTagService;
let tagModel: TagModel;
let cardModel: DictionaryCardModel;

beforeAll(async () => {
  await clearDatabase();
  const modelContainer = await setupTestModelContainer();
  tagModel = modelContainer.resolve(TagModel);
  cardModel = modelContainer.resolve(DictionaryCardModel);
  
  const serviceContainer = await setupTestServiceContainer();
  cardTagService = serviceContainer.resolve(CardTagService);
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await closeDatabase();
});

const createCardData = async (): Promise<DictionaryCard & { translations: Array<CardTranslation>, meanings: Array<CardMeaning>, examples: Array<CardExample> }> => {
    const cardId = uuidv4();

    const card: DictionaryCard = {
        cardId: cardId,
        original: 'cat',
        transcription: '/kæt/',
        pronunciation: 'https://example.com/pronunciation/cat.mp3'
    }

    const translations: Array<CardTranslation> = [
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
    ]

    const meanings: Array<CardMeaning> = [
        {
            cardId: cardId,
            meaning: 'domestic furry animal',
            dictionaryMeaningId: uuidv4()
        }
    ]

    const examples: Array<CardExample> = [
        {
            cardId: cardId,
            example: 'I have two dogs and a cat',
            exampleId: uuidv4(),
            translation: 'у меня есть два собаки и кошка'
        }
    ]

    return { ...card, translations, meanings, examples };
}

describe('CardTagService', () => {
  test('should add a tag to a card', async () => {
    const card = await createCardData();
    
    const tagId = uuidv4();

    await cardModel.createCard(card, card.translations, card.meanings, card.examples);
    await tagModel.createTag(tagId, 'Animals');

    const result = await cardTagService.addTagToCard(card.cardId, tagId);
    expect(result).toBe(true);
  });

  test('should not add tag to card if cardId or tagId is missing', async () => {
    const result = await cardTagService.addTagToCard('', '');
    expect(result).toBe(false);
  });

  test('should remove a tag from a card', async () => {
    const card = await createCardData();
    
    const tagId = uuidv4();

    await cardModel.createCard(card, card.translations, card.meanings, card.examples);
    await tagModel.createTag(tagId, 'Pets');
    await cardTagService.addTagToCard(card.cardId, tagId);

    const result = await cardTagService.removeTagFromCard(card.cardId, tagId);
    expect(result).toBe(true);
  });

  test('should not remove tag if cardId or tagId is missing', async () => {
    const result = await cardTagService.removeTagFromCard('', '');
    expect(result).toBe(false);
  });

  test('should get tags for a card', async () => {
    const card = await createCardData();
    const tagId1 = uuidv4();
    const tagId2 = uuidv4();

    await cardModel.createCard(card, card.translations, card.meanings, card.examples);
    await tagModel.createTag(tagId1, 'Pets');
    await tagModel.createTag(tagId2, 'Animals');
    await cardTagService.addTagToCard(card.cardId, tagId1);
    await cardTagService.addTagToCard(card.cardId, tagId2);

    const tags = (await cardTagService.getTagsForCard(card.cardId)).map(tag => tag.tagId);
    expect(tags).toEqual(expect.arrayContaining([tagId1, tagId2]));
  });

  test('should return empty array if cardId is missing', async () => {
    const tags = await cardTagService.getTagsForCard('');
    expect(tags).toEqual([]);
  });
});
