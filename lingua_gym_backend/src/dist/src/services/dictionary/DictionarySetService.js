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
import { DictionarySetRepository } from '../../repositories/dictionary/dictionary.js';
import logger from '../../utils/logger/Logger.js';
import { injectable, inject } from 'tsyringe';
let DictionarySetService = class DictionarySetService {
    constructor(model) {
        this.model = model;
    }
    createSet(set) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!set.dictionarySetId || !set.name || !set.ownerId) {
                logger.warn({ set }, 'Validation failed while creating dictionary set');
                return null;
            }
            try {
                logger.info('Creating dictionary set');
                return yield this.model.createSet(set);
            }
            catch (error) {
                logger.error({ error, set }, 'Failed to create dictionary set');
                return null;
            }
        });
    }
    deleteSet(setId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!setId) {
                logger.warn('Missing set ID for deletion');
                return false;
            }
            try {
                return yield this.model.deleteSet(setId);
            }
            catch (error) {
                logger.error({ error, setId }, 'Failed to delete dictionary set');
                return false;
            }
        });
    }
    getSetById(setId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!setId) {
                logger.warn('Set ID is required');
                return null;
            }
            try {
                return yield this.model.getSetById(setId);
            }
            catch (error) {
                logger.error({ error, setId }, 'Failed to fetch dictionary set');
                return null;
            }
        });
    }
};
DictionarySetService = __decorate([
    injectable(),
    __param(0, inject('DictionarySetRepository')),
    __metadata("design:paramtypes", [DictionarySetRepository])
], DictionarySetService);
export default DictionarySetService;
