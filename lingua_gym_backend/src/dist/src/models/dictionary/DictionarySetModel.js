var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import logger from '../../utils/logger/Logger.js';
class DictionarySetModel {
    constructor(dbInstance) {
        this.db = dbInstance;
    }
    createSet(name, ownerId, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO dictionary_sets (name, owner_id, description) VALUES ($1, $2, $3) RETURNING *`;
            const values = [name, ownerId, description || null];
            try {
                const result = yield this.db.query(query, values);
                return result.rows[0];
            }
            catch (error) {
                logger.error({ error }, 'Error creating dictionary set');
                throw error;
            }
        });
    }
    getSetById(setId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM dictionary_sets WHERE set_id = $1`;
            try {
                const result = yield this.db.query(query, [setId]);
                return result.rows[0] || null;
            }
            catch (error) {
                logger.error({ error }, 'Error fetching dictionary set');
                throw error;
            }
        });
    }
    deleteSet(setId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM dictionary_sets WHERE set_id = $1 RETURNING *`;
            try {
                const result = yield this.db.query(query, [setId]);
                return result.rows[0] || null;
            }
            catch (error) {
                logger.error({ error }, 'Error deleting dictionary set');
                throw error;
            }
        });
    }
    addTagToSet(setId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO set_tags (set_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`;
            try {
                const result = yield this.db.query(query, [setId, tagId]);
                return result.rowCount > 0;
            }
            catch (error) {
                logger.error({ error, setId, tagId }, 'Error adding tag to set');
                return false;
            }
        });
    }
    removeTagFromSet(setId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM set_tags WHERE set_id = $1 AND tag_id = $2;`;
            try {
                const result = yield this.db.query(query, [setId, tagId]);
                return result.rowCount > 0;
            }
            catch (error) {
                logger.error({ error, setId, tagId }, 'Error removing tag from set');
                return false;
            }
        });
    }
    getTagsForSet(setId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT t.name FROM tags t INNER JOIN set_tags st ON t.tag_id = st.tag_id WHERE st.set_id = $1;`;
            try {
                const result = yield this.db.query(query, [setId]);
                return result.rows.map(row => row.name);
            }
            catch (error) {
                logger.error({ error, setId }, 'Error fetching tags for set');
                return [];
            }
        });
    }
}
export default DictionarySetModel;
