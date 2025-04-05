import Database from '../../database/config/db-connection.js';
import { DictionarySet } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';

class DictionarySetModel {
    private db;

    constructor(dbInstance: Database) {
        this.db = dbInstance;
    }

    async createSet(dictionarySet: DictionarySet): Promise<DictionarySet> {
        const query = `
            INSERT INTO "DictionarySets" 
                (dictionary_set_id, name, owner_id, description, is_public) 
            VALUES 
                ($1, $2, $3, $4, $5) 
            RETURNING 
                dictionary_set_id as "dictionarySetId",
                name,
                owner_id as "ownerId",
                description,
                is_public as "isPublic",
                created_at as "createdAt"
        `;
        
        const values = [
            dictionarySet.dictionarySetId,
            dictionarySet.name,
            dictionarySet.ownerId,
            dictionarySet.description || null,
            dictionarySet.isPublic || false,
        ];
        
        try {
            const result = await this.db.query<DictionarySet>(query, values);
            return result.rows[0];
        } catch (error) {
            logger.error({ error }, 'Error creating dictionary set');
            throw error;
        }
    }

    async getSetById(setId: string): Promise<DictionarySet | null> {
        const query = `
            SELECT 
                dictionary_set_id as "dictionarySetId",
                name,
                owner_id as "ownerId",
                description,
                is_public as "isPublic",
                created_at as "createdAt"
            FROM "DictionarySets" 
            WHERE dictionary_set_id = $1
        `;
        
        try {
            const result = await this.db.query<DictionarySet>(query, [setId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error fetching dictionary set');
            throw error;
        }
    }

    async deleteSet(setId: string): Promise<DictionarySet | null> {
        const query = `
            DELETE FROM "DictionarySets" 
            WHERE dictionary_set_id = $1 
            RETURNING 
                dictionary_set_id as "dictionarySetId",
                name,
                owner_id as "ownerId",
                description,
                is_public as "isPublic",
                created_at as "createdAt"
        `;
        
        try {
            const result = await this.db.query<DictionarySet>(query, [setId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error deleting dictionary set');
            throw error;
        }
    }
}

export default DictionarySetModel;
