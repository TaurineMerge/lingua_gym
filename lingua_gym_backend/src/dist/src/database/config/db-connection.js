var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pg from 'pg';
import logger from '../../utils/logger/Logger.js';
import 'dotenv/config';
class Database {
    constructor() {
        this.pool = new pg.Pool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            user: process.env.DB_USER || 'user',
            password: process.env.DB_PASSWORD || 'password',
            database: process.env.DB_NAME || 'dbname',
            max: parseInt(process.env.DB_MAX_CONNECTIONS || '10', 10),
            idleTimeoutMillis: 10000,
            connectionTimeoutMillis: 2000,
        });
        this.pool.on('error', (err) => {
            logger.fatal({ err }, 'Unexpected error on idle client');
            process.exit(-1);
        });
        process.on('SIGINT', () => __awaiter(this, void 0, void 0, function* () {
            logger.info('Received SIGINT, shutting down...');
            yield this.close();
            process.exit(0);
        }));
        process.on('SIGTERM', () => __awaiter(this, void 0, void 0, function* () {
            logger.info('Received SIGTERM, shutting down...');
            yield this.close();
            process.exit(0);
        }));
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    query(text, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info({ query: text, params }, 'Executing query');
                return yield this.pool.query(text, params);
            }
            catch (err) {
                logger.error({ query: text, params, err }, 'Query failed');
                throw err;
            }
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.pool.end();
            logger.info('Database pool closed');
        });
    }
}
Database.instance = null;
export default Database;
