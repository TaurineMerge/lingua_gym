import Database from '../../../src/database/config/db-connection.js';
import { SetCardsModel, DictionarySetModel, DictionaryCardModel } from '../../../src/models/dictionary/dictionary.js';
import { DictionaryCard, DictionarySet, SetCards, CardTranslation, CardMeaning, CardExample } from '../../../src/database/interfaces/DbInterfaces.js';
import { v4 as uuidv4 } from 'uuid';

let db: Database;
let setCardsModel: SetCardsModel;
let setModel: DictionarySetModel;
let cardModel: DictionaryCardModel;

beforeAll(async () => {
    db = Database.getInstance();
    setCardsModel = new SetCardsModel(db);
    setModel = new DictionarySetModel(db);
    cardModel = new DictionaryCardModel(db);

    await clearDatabase();
});

afterAll(async () => {
    await db.close();
});

afterEach(async () => {
    await clearDatabase();
});

const clearDatabase = async () => {
    await db.query('DELETE FROM "SetCards"');
    await db.query('DELETE FROM "DictionaryCards"');
    await db.query('DELETE FROM "DictionarySets"');
}

const createSet = async (): Promise<string> => {
    const setId = uuidv4();
    const ownerId = uuidv4();
    const setName = 'Test Set';
    const description = 'Set for testing';

    const set: DictionarySet = {
        dictionarySetId: setId,
        name: setName,
        ownerId: ownerId,
        description: description,
        isPublic: false,
        createdAt: new Date(),
    }

    await setModel.createSet(set);

    return setId;
};

const createCard = async (): Promise<string> => {
    const cardId = uuidv4();
    const original = 'Test Card';
    const translation = 'Test Card Translation';
    const meaning = 'Test Card Meaning';
    const example = 'Test Card Example';
    const transcription = 'Test Card Transcription';
    const pronunciation = 'Test Card Pronunciation';

    const card: DictionaryCard = {
        dictionaryCardId: cardId,
        original: original,
        transcription: transcription,
        pronunciation: pronunciation
    }

    const translations: Array<CardTranslation> = [
        {
            dictionaryCardId: cardId,
            translation: translation
        }
    ]

    const meanings: Array<CardMeaning> = [
        {
            dictionaryCardId: cardId,
            meaning: meaning
        }
    ]

    const examples: Array<CardExample> = [
        {
            dictionaryCardId: cardId,
            example: example
        }
    ]

    await cardModel.createCard(card, translations, meanings, examples);

    return cardId;
};

describe('SetCardsModel integration', () => {

    test('addCardToSet should add card to set', async () => {
        const setId = await createSet();
        const cardId = await createCard();

        const result = (await setCardsModel.addCardToSet(setId, cardId)) as SetCards;
        
        expect(result).not.toBeNull();
        expect(result!.cardId).toBe(cardId);
        expect(result!.setId).toBe(setId);
    });

    test('removeCardFromSet should remove card from set', async () => {
        const setId = await createSet();
        const cardId = await createCard();

        await setCardsModel.addCardToSet(setId, cardId);
        const removed= await setCardsModel.removeCardFromSet(setId, cardId) as SetCards;

        expect(removed).not.toBeNull();
        expect(removed!.cardId).toBe(cardId);

        const cards = await setCardsModel.getCardsBySet(setId);

        expect(cards).toBeNull();
    });

    test('removeCardFromSet should return null if card not linked', async () => {
        const setId = await createSet();
        const cardId = await createCard();

        const removed = await setCardsModel.removeCardFromSet(setId, cardId);

        expect(removed).toBeNull();
    });

    test('getCardsBySet should return all cards in set', async () => {
        const setId = await createSet();
        const cardId1 = await createCard();
        const cardId2 = await createCard();

        await setCardsModel.addCardToSet(setId, cardId1);
        await setCardsModel.addCardToSet(setId, cardId2);

        const cards = await setCardsModel.getCardsBySet(setId) as DictionaryCard[];

        expect(cards).not.toBeNull();
        expect(cards!.length).toBe(2);

        const cardIds = cards!.map(c => c.dictionaryCardId);

        expect(cardIds).toContain(cardId1);
        expect(cardIds).toContain(cardId2);
    });

    test('getCardsBySet should return null if no cards linked', async () => {
        const setId = await createSet();
        const result = await setCardsModel.getCardsBySet(setId);

        expect(result).toBeNull();
    });
});
