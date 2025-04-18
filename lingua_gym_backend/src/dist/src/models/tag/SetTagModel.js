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
let SetTagModel = class SetTagModel {
    constructor(db) {
        this.db = db;
    }
    addTagToSet(setId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO "SetTag" (set_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`;
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
            const query = `DELETE FROM "SetTag" WHERE set_id = $1 AND tag_id = $2;`;
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
            const query = `SELECT t.name, t.tag_id AS "tagId", st.set_id AS "setId" FROM "Tag" t INNER JOIN "SetTag" st ON t.tag_id = st.tag_id WHERE st.set_id = $1;`;
            try {
                const result = yield this.db.query(query, [setId]);
                return result.rows;
            }
            catch (error) {
                logger.error({ error, setId }, 'Error fetching tags for set');
                return [];
            }
        });
    }
};
SetTagModel = __decorate([
    injectable(),
    __param(0, inject('Database')),
    __metadata("design:paramtypes", [Database])
], SetTagModel);
export default SetTagModel;
