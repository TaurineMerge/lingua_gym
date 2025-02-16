var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Pool } from 'pg';
import Database from '../../../../src/database/config/db-connection.js';
import logger from '../../../../src/utils/logger/Logger.js';
jest.mock('pg', () => {
    const mockQuery = jest.fn();
    const mockEnd = jest.fn();
    return {
        Pool: jest.fn(() => ({
            query: mockQuery,
            end: mockEnd,
            on: jest.fn(),
        })),
    };
});
jest.mock('../../../../src/utils/logger/logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn(),
}));
describe('Database', () => {
    let db;
    const mockPool = new Pool();
    beforeEach(() => {
        jest.clearAllMocks();
        db = Database.getInstance();
    });
    test('getInstance() should return the same instance', () => {
        const db2 = Database.getInstance();
        expect(db).toBe(db2);
    });
    test('query() should call pool.query() with correct arguments', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockResult = {
            rows: [{ id: 1, name: 'test' }],
            rowCount: 1,
            command: 'SELECT',
            oid: 0,
            fields: [],
        };
        const queryText = 'SELECT * FROM users WHERE id = $1';
        const params = [1];
        mockPool.query.mockResolvedValue(mockResult);
        const result = yield db.query(queryText, params);
        expect(mockPool.query).toHaveBeenCalledWith(queryText, params);
        expect(result).toEqual(mockResult);
    }));
    test('query() should log and throw an error on failure', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('Query failed');
        mockPool.query.mockRejectedValue(error);
        yield expect(db.query('INVALID QUERY')).rejects.toThrow('Query failed');
        expect(logger.error).toHaveBeenCalledWith(expect.objectContaining({ query: 'INVALID QUERY', err: error }), 'Query failed');
    }));
    test('close() should call pool.end()', () => __awaiter(void 0, void 0, void 0, function* () {
        yield db.close();
        expect(mockPool.end).toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledWith('Database pool closed');
    }));
});
