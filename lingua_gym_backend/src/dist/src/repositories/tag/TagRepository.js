var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
import 'reflect-metadata';
import Database from '../../database/config/db-connection.js';
import logger from '../../utils/logger/Logger.js';
import { inject, injectable } from 'tsyringe';
let TagRepository = class TagRepository {
    constructor(db) {
        this.db = db;
    }
    createTag(tagId, name) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const query = `INSERT INTO "Tag" (tag_id, name) VALUES ($1, $2) RETURNING tag_id;`;
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
            const query = `
        SELECT
            tag_id AS "tagId",
            name AS "name"
        FROM "Tag" WHERE tag_id = $1;`;
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
            const query = `
        SELECT
            tag_id AS "tagId",
            name
        FROM "Tag";`;
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
            const query = `UPDATE "Tag" SET name = $1 WHERE tag_id = $2 RETURNING tag_id AS "tagId", name;`;
            try {
                const result = yield this.db.query(query, [name, tagId]);
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
            const query = `DELETE FROM "Tag" WHERE tag_id = $1 RETURNING tag_id AS "tagId", name;`;
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
TagRepository = __decorate([
    injectable(),
    __param(0, inject('Database')),
    __metadata("design:paramtypes", [Database])
], TagRepository);
export default TagRepository;
