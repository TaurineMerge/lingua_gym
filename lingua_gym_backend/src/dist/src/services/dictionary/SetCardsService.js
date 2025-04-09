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
import { SetCardsModel } from '../../../src/models/dictionary/dictionary.js';
import logger from '../../utils/logger/Logger.js';
import { injectable } from 'tsyringe';
let SetCardsService = class SetCardsService {
    constructor(model) {
        this.model = model;
    }
    addCardToSet(setId, cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!setId || !cardId) {
                logger.warn({ setId, cardId }, 'Validation failed: setId or cardId missing');
                return false;
            }
            try {
                return yield this.model.addCardToSet(setId, cardId);
            }
            catch (error) {
                logger.error({ error, setId, cardId }, 'Failed to add card to set');
                return false;
            }
        });
    }
    removeCardFromSet(setId, cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!setId || !cardId) {
                logger.warn({ setId, cardId }, 'Validation failed: setId or cardId missing');
                return false;
            }
            try {
                return yield this.model.removeCardFromSet(setId, cardId);
            }
            catch (error) {
                logger.error({ error, setId, cardId }, 'Failed to remove card from set');
                return false;
            }
        });
    }
    getCardsForSet(setId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!setId) {
                logger.warn('Set ID is required to fetch cards');
                return [];
            }
            try {
                return yield this.model.getCardsBySet(setId);
            }
            catch (error) {
                logger.error({ error, setId }, 'Failed to get cards for set');
                return [];
            }
        });
    }
};
SetCardsService = __decorate([
    injectable(),
    __metadata("design:paramtypes", [SetCardsModel])
], SetCardsService);
export default SetCardsService;
