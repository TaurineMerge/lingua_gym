import { SetCardModel, DictionarySetModel, DictionaryCardModel } from '../../../../src/repositories/dictionary/dictionary.js';
import { DictionaryCard, DictionarySet, SetCard, CardTranslation, CardMeaning, CardExample, User } from '../../../../src/database/interfaces/DbInterfaces.js';
import { v4 as uuidv4 } from 'uuid';
import { clearDatabase, closeDatabase, setupTestModelContainer } from '../../../utils/di/TestContainer.js';
import hash_password from '../../../../src/utils/hash/HashPassword.js';
import { UserModel } from '../../../../src/repositories/access_management/access_management.js';

let setCardModel: SetCardModel;
let setModel: DictionarySetModel;
let cardModel: DictionaryCardModel;
let userModel: UserModel;

beforeAll(async () => {
    await clearDatabase();
    const modelContainer = await setupTestModelContainer();

    setCardModel = modelContainer.resolve(SetCardModel);
    setModel = modelContainer.resolve(DictionarySetModel);
    cardModel = modelContainer.resolve(DictionaryCardModel);
    userModel = modelContainer.resolve(UserModel);
});

afterAll(async () => {
    await clearDatabase();
    await closeDatabase();
});

afterEach(async () => {
    await clearDatabase();
});

const createUser = async (): Promise<string> => {
    const userId = uuidv4();
    const userName = `Test User ${Math.random().toString(36).substring(2, 8)}`;
    const passwrod = 'password123';
    const user: User = {
        userId: userId,
        username: userName,
        displayName: userName,
        passwordHash: hash_password(passwrod),
        email: `${userName}@example.com`,
        tokenVersion: 0,
        profilePicture: 'photo.png',
        emailVerified: false
    }
    await userModel.createUser(user);
    return userId;
}

const createSet = async (): Promise<string> => {
    const setId = uuidv4();
    const ownerId = await createUser();
    const setName = 'Test Set';
    const description = 'Set for testing';

    const set: DictionarySet = {
        dictionarySetId: setId,
        name: setName,
        ownerId: ownerId,
        description: description,
        isPublic: false,
        languageCode: 'en',
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
        cardId: cardId,
        original: original,
        transcription: transcription,
        pronunciation: pronunciation
    }

    const translations: Array<CardTranslation> = [
        {
            cardId: cardId,
            translation: translation,
            translationId: uuidv4()
        }
    ]

    const meanings: Array<CardMeaning> = [
        {
            cardId: cardId,
            meaning: meaning,
            dictionaryMeaningId: uuidv4()
        }
    ]

    const examples: Array<CardExample> = [
        {
            cardId: cardId,
            example: example,
            exampleId: uuidv4(),
            translation: translation
        }
    ]

    await cardModel.createCard(card, translations, meanings, examples);

    return cardId;
};

describe('SetCardsModel integration', () => {

    test('addCardToSet should add card to set', async () => {
        const setId = await createSet();
        const cardId = await createCard();

        const result = (await setCardModel.addCardToSet(setId, cardId)) as SetCard;
        
        expect(result).not.toBeNull();
        expect(result!.cardId).toBe(cardId);
        expect(result!.setId).toBe(setId);
    });

    test('removeCardFromSet should remove card from set', async () => {
        const setId = await createSet();
        const cardId = await createCard();

        await setCardModel.addCardToSet(setId, cardId);
        const removed= await setCardModel.removeCardFromSet(setId, cardId) as SetCard;

        expect(removed).not.toBeNull();
        expect(removed!.cardId).toBe(cardId);

        const cards = await setCardModel.getCardsBySet(setId);

        expect(cards).toBeNull();
    });

    test('removeCardFromSet should return null if card not linked', async () => {
        const setId = await createSet();
        const cardId = await createCard();

        const removed = await setCardModel.removeCardFromSet(setId, cardId);

        expect(removed).toBeNull();
    });

    test('getCardsBySet should return all cards in set', async () => {
        const setId = await createSet();
        const cardId1 = await createCard();
        const cardId2 = await createCard();

        await setCardModel.addCardToSet(setId, cardId1);
        await setCardModel.addCardToSet(setId, cardId2);

        const cards = await setCardModel.getCardsBySet(setId) as DictionaryCard[];

        expect(cards).not.toBeNull();
        expect(cards!.length).toBe(2);

        const cardIds = cards!.map(c => c.cardId);

        expect(cardIds).toContain(cardId1);
        expect(cardIds).toContain(cardId2);
    });

    test('getCardsBySet should return null if no cards linked', async () => {
        const setId = await createSet();
        const result = await setCardModel.getCardsBySet(setId);

        expect(result).toBeNull();
    });
});