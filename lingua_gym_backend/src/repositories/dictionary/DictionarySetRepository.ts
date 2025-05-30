import 'reflect-metadata';
import Database from '../../database/config/db-connection.js';
import { IDictionarySet } from '../../database/interfaces/DbInterfaces.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';

@injectable()
class DictionarySetRepository {
    constructor(@inject('Database') private db: Database) {}

    async createSet(dictionarySet: IDictionarySet): Promise<IDictionarySet> {
        const query = `
            INSERT INTO "DictionarySet" 
                (set_id, name, owner_id, description, language_code, is_public) 
            VALUES 
                ($1, $2, $3, $4, $5, $6) 
            RETURNING 
                set_id as "dictionarySetId",
                name,
                owner_id as "ownerId",
                description,
                language_code as "languageCode",
                is_public as "isPublic",
                created_at as "createdAt"
        `;
        
        const values = [
            dictionarySet.dictionarySetId,
            dictionarySet.name,
            dictionarySet.ownerId,
            dictionarySet.description || null,
            dictionarySet.languageCode,
            dictionarySet.isPublic || false,
        ];
        
        try {
            const result = await this.db.query<IDictionarySet>(query, values);
            return result.rows[0];
        } catch (error) {
            logger.error({ error }, 'Error creating dictionary set');
            throw error;
        }
    }

    async getSetById(setId: string): Promise<IDictionarySet | null> {
        const query = `
            SELECT 
                set_id as "dictionarySetId",
                name,
                owner_id as "ownerId",
                description,
                language_code as "languageCode",
                is_public as "isPublic",
                created_at as "createdAt"
            FROM "DictionarySet" 
            WHERE set_id = $1
        `;
        
        try {
            const result = await this.db.query<IDictionarySet>(query, [setId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error fetching dictionary set');
            throw error;
        }
    }

    async deleteSet(setId: string): Promise<IDictionarySet | null> {
        const query = `
            DELETE FROM "DictionarySet" 
            WHERE set_id = $1 
            RETURNING 
                set_id as "dictionarySetId",
                name,
                owner_id as "ownerId",
                description,
                language_code as "languageCode",
                is_public as "isPublic",
                created_at as "createdAt"
        `;
        
        try {
            const result = await this.db.query<IDictionarySet>(query, [setId]);
            return result.rows[0] || null;
        } catch (error) {
            logger.error({ error }, 'Error deleting dictionary set');
            throw error;
        }
    }
}

export default DictionarySetRepository;
