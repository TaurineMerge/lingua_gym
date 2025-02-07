import { Pool, QueryResult } from 'pg';
import Database from '../../../../database/config/db-connection';
import logger from '../../../../src/utils/logger/Logger';

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
  let db: Database;
  const mockPool = new Pool() as jest.Mocked<Pool>;

  beforeEach(() => {
    jest.clearAllMocks();
    db = Database.getInstance();
  });

  test('getInstance() should return the same instance', () => {
    const db2 = Database.getInstance();
    expect(db).toBe(db2);
  });

  test('query() should call pool.query() with correct arguments', async () => {
    const mockResult: QueryResult<{ id: number; name: string }> = {
      rows: [{ id: 1, name: 'test' }],
      rowCount: 1,
      command: 'SELECT',
      oid: 0,
      fields: [],
    };

    const queryText = 'SELECT * FROM users WHERE id = $1';
    const params = [1];

    (mockPool.query as jest.Mock).mockResolvedValue(mockResult);

    const result = await db.query(queryText, params);

    expect(mockPool.query).toHaveBeenCalledWith(queryText, params);
    expect(result).toEqual(mockResult);
  });

  test('query() should log and throw an error on failure', async () => {
    const error: Error = new Error('Query failed');
    (mockPool.query as jest.Mock).mockRejectedValue(error);

    await expect(db.query('INVALID QUERY')).rejects.toThrow('Query failed');

    expect(logger.error).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'INVALID QUERY', err: error }),
      'Query failed'
    );
  });

  test('close() should call pool.end()', async () => {
    await db.close();
    expect(mockPool.end).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Database pool closed');
  });
});
