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
class TagModel {
    constructor(dbInstance) {
        this.db = dbInstance;
    }
    createTag(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = `INSERT INTO tags (name, description) VALUES ($1, $2) RETURNING tag_id;`;
            try {
                const result = yield this.db.query(query, [name, description || null]);
                return ((_a = result.rows[0]) === null || _a === void 0 ? void 0 : _a.tag_id) || null;
            }
            catch (error) {
                logger.error({ error, name }, 'Error creating tag');
                return null;
            }
        });
    }
    getTagById(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM tags WHERE tag_id = $1;`;
            try {
                const result = yield this.db.query(query, [tagId]);
                return result.rows[0] || null;
            }
            catch (error) {
                logger.error({ error, tagId }, 'Error fetching tag');
                return null;
            }
        });
    }
    getAllTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT * FROM tags ORDER BY name;`;
            try {
                const result = yield this.db.query(query);
                return result.rows;
            }
            catch (error) {
                logger.error({ error }, 'Error fetching all tags');
                return [];
            }
        });
    }
    updateTag(tagId, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `UPDATE tags SET name = $1, description = $2 WHERE tag_id = $3;`;
            try {
                const result = yield this.db.query(query, [name, description || null, tagId]);
                return result.rowCount > 0;
            }
            catch (error) {
                logger.error({ error, tagId }, 'Error updating tag');
                return false;
            }
        });
    }
    deleteTag(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM tags WHERE tag_id = $1;`;
            try {
                const result = yield this.db.query(query, [tagId]);
                return result.rowCount > 0;
            }
            catch (error) {
                logger.error({ error, tagId }, 'Error deleting tag');
                return false;
            }
        });
    }
}
export default TagModel;
