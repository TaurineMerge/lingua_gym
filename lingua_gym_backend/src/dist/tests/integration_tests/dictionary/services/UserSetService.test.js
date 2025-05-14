var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { setupTestRepositoryContainer, setupTestServiceContainer, clearDatabase, closeDatabase } from '../../../utils/di/TestContainer.js';
import { DictionarySetRepository } from '../../../../src/repositories/dictionary/dictionary.js';
import UserSetService from '../../../../src/services/dictionary/UserSetService.js';
import { LanguageCode } from '../../../../src/database/interfaces/DbInterfaces.js';
import { v4 as uuidv4 } from 'uuid';
let userSetService;
let setModel;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    const modelContainer = yield setupTestRepositoryContainer();
    setModel = modelContainer.resolve(DictionarySetRepository);
    const serviceContainer = yield setupTestServiceContainer();
    userSetService = serviceContainer.resolve(UserSetService);
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    yield closeDatabase();
}));
describe('UserSetService', () => {
    const testSet = {
        dictionarySetId: uuidv4(),
        name: 'Test Set',
        description: 'Shared set',
        ownerId: uuidv4(),
        isPublic: false,
        languageCode: LanguageCode.ENGLISH,
    };
    test('should add user to set with permission', () => __awaiter(void 0, void 0, void 0, function* () {
        yield setModel.createSet(testSet);
        const userId = uuidv4();
        const result = yield userSetService.addUserSet(userId, testSet.dictionarySetId, 'read');
        expect(result).not.toBe(false);
        if (result !== false && result !== true) {
            expect(result.setId).toBe(testSet.dictionarySetId);
            expect(result.userId).toBe(userId);
            expect(result.permission).toBe('read');
        }
    }));
    test('should return sets for user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield setModel.createSet(testSet);
        const userId = uuidv4();
        yield userSetService.addUserSet(userId, testSet.dictionarySetId, 'write');
        const sets = yield userSetService.getUserSets(userId);
        expect(sets.length).toBe(1);
        expect(sets[0].setId).toBe(testSet.dictionarySetId);
    }));
    test('should return users for set', () => __awaiter(void 0, void 0, void 0, function* () {
        yield setModel.createSet(testSet);
        const userId1 = uuidv4();
        const userId2 = uuidv4();
        yield userSetService.addUserSet(userId1, testSet.dictionarySetId, 'read');
        yield userSetService.addUserSet(userId2, testSet.dictionarySetId, 'write');
        const users = yield userSetService.getUsersForSet(testSet.dictionarySetId);
        expect(users.length).toBe(2);
        const userIds = users.map(u => u.userId);
        expect(userIds).toContain(userId1);
        expect(userIds).toContain(userId2);
    }));
    test('should remove user from set', () => __awaiter(void 0, void 0, void 0, function* () {
        yield setModel.createSet(testSet);
        const userId = uuidv4();
        yield userSetService.addUserSet(userId, testSet.dictionarySetId, 'read');
        const removed = yield userSetService.removeUserSet(userId, testSet.dictionarySetId);
        expect(removed).not.toBe(false);
        const users = yield userSetService.getUsersForSet(testSet.dictionarySetId);
        expect(users.length).toBe(0);
    }));
    test('should return false if userId or setId missing when adding', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield userSetService.addUserSet('', '', 'read');
        expect(result).toBe(false);
    }));
    test('should return false if userId or setId missing when removing', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield userSetService.removeUserSet('', '');
        expect(result).toBe(false);
    }));
    test('should return empty array if userId is missing in getUserSets', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield userSetService.getUserSets('');
        expect(result).toEqual([]);
    }));
    test('should return empty array if setId is missing in getUsersForSet', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield userSetService.getUsersForSet('');
        expect(result).toEqual([]);
    }));
});
