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
let DictionarySetModel = class DictionarySetModel {
    constructor(dbInstance) {
        this.db = dbInstance;
    }
    createSet(dictionarySet) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const result = yield this.db.query(query, [setId]);
                return result.rows[0] || null;
            }
            catch (error) {
                logger.error({ error }, 'Error deleting dictionary set');
                throw error;
            }
        });
    }
};
DictionarySetModel = __decorate([
    injectable(),
    __metadata("design:paramtypes", [Database])
], DictionarySetModel);
export default DictionarySetModel;
