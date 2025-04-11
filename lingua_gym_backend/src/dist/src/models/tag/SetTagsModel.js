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
let SetTagsModel = class SetTagsModel {
    constructor(dbInstance) {
        this.db = dbInstance;
    }
    addTagToSet(setId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `INSERT INTO "SetTags" (set_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING;`;
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
            const query = `DELETE FROM "SetTags" WHERE set_id = $1 AND tag_id = $2;`;
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
            const query = `SELECT t.name FROM "Tags" t INNER JOIN "SetTags" st ON t.tag_id = st.tag_id WHERE st.set_id = $1;`;
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
};
SetTagsModel = __decorate([
    injectable(),
    __metadata("design:paramtypes", [Database])
], SetTagsModel);
export default SetTagsModel;
