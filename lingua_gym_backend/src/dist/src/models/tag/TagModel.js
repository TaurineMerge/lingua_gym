var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Database from '../../database/config/db-connection.js';
import logger from '../../utils/logger/Logger.js';
import { injectable } from 'tsyringe';
let TagModel = class TagModel {
    constructor(dbInstance) {
        this.db = dbInstance;
    }
    createTag(tagId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = `INSERT INTO "Tags" (tag_id, name) VALUES ($1, $2) RETURNING tag_id;`;
            try {
                const result = yield this.db.query(query, [tagId, name || null]);
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
            const query = `SELECT * FROM "Tags" WHERE tag_id = $1;`;
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
            const query = `SELECT * FROM "Tags" ORDER BY name;`;
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
    updateTag(tagId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `UPDATE "Tags" SET name = $1, description = $2 WHERE tag_id = $3;`;
            try {
                const result = yield this.db.query(query, [tagId, name]);
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
            const query = `DELETE FROM "Tags" WHERE tag_id = $1;`;
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
};
TagModel = __decorate([
    injectable(),
    __metadata("design:paramtypes", [Database])
], TagModel);
export default TagModel;
