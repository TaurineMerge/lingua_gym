var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import DictionarySetService from '../../../../src/services/dictionary/DictionarySetService.js';
import { setupTestServiceContainer, clearDatabase, closeDatabase } from '../../../utils/di/TestContainer.js';
import { v4 as uuidv4 } from 'uuid';
import { RegistrationService } from '../../../../src/services/access_management/access_management.js';
let dictionarySetService;
let registrationService;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    const serviceContainer = yield setupTestServiceContainer();
    dictionarySetService = serviceContainer.resolve(DictionarySetService);
    registrationService = serviceContainer.resolve(RegistrationService);
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield clearDatabase();
    yield closeDatabase();
}));
describe('DictionarySetService', () => {
    let testSet;
    let testUser;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        testUser = {
            userId: '',
            username: 'testuser',
            displayName: 'Test User',
            email: 'test@example.com',
        };
        testUser.userId = (yield registrationService.register(testUser.username, testUser.email, 'password123', testUser.displayName)).userId;
        testSet = {
            dictionarySetId: uuidv4(),
            name: 'Basic verbs',
            description: 'Common verbs in English',
            ownerId: testUser.userId,
            isPublic: true,
            languageCode: 'en',
        };
    }));
    test('should create a dictionary set', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield dictionarySetService.createSet(testSet);
        expect(result).not.toBeNull();
        expect(result === null || result === void 0 ? void 0 : result.dictionarySetId).toBe(testSet.dictionarySetId);
    }));
    test('should return the created set by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield dictionarySetService.createSet(testSet);
        const fetched = yield dictionarySetService.getSetById(testSet.dictionarySetId);
        expect(fetched).not.toBeNull();
        expect(fetched === null || fetched === void 0 ? void 0 : fetched.name).toBe('Basic verbs');
    }));
    test('should delete the set by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield dictionarySetService.createSet(testSet);
        const deleted = yield dictionarySetService.deleteSet(testSet.dictionarySetId);
        expect(deleted).not.toBe(false);
        if (deleted !== false) {
            expect(deleted.dictionarySetId).toBe(testSet.dictionarySetId);
        }
        const afterDelete = yield dictionarySetService.getSetById(testSet.dictionarySetId);
        expect(afterDelete).toBeNull();
    }));
    test('should return null when creating set with invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
        const badSet = Object.assign(Object.assign({}, testSet), { dictionarySetId: '', name: '', ownerId: '' });
        const result = yield dictionarySetService.createSet(badSet);
        expect(result).toBeNull();
    }));
    test('should return null for getSetById if ID is empty', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield dictionarySetService.getSetById('');
        expect(result).toBeNull();
    }));
    test('should return false for deleteSet if ID is empty', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield dictionarySetService.deleteSet('');
        expect(result).toBe(false);
    }));
});
