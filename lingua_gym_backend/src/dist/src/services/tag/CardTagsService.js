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
import { CardTagsModel } from '../../../src/models/tag/tag.js';
import logger from '../../utils/logger/Logger.js';
import { injectable } from 'tsyringe';
let CardTagsService = class CardTagsService {
    constructor(model) {
        this.model = model;
    }
    addTagToCard(cardId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cardId || !tagId) {
                logger.warn({ cardId, tagId }, 'Validation failed: cardId or tagId missing');
                return false;
            }
            try {
                return yield this.model.addTagToCard(cardId, tagId);
            }
            catch (error) {
                logger.error({ error, cardId, tagId }, 'Failed to add tag to card');
                return false;
            }
        });
    }
    removeTagFromCard(cardId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cardId || !tagId) {
                logger.warn({ cardId, tagId }, 'Validation failed: cardId or tagId missing');
                return false;
            }
            try {
                return yield this.model.removeTagFromCard(cardId, tagId);
            }
            catch (error) {
                logger.error({ error, cardId, tagId }, 'Failed to remove tag from card');
                return false;
            }
        });
    }
    getTagsForCard(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cardId) {
                logger.warn('Card ID is required to get tags');
                return [];
            }
            try {
                return yield this.model.getTagsForCard(cardId);
            }
            catch (error) {
                logger.error({ error, cardId }, 'Failed to get tags for card');
                return [];
            }
        });
    }
};
CardTagsService = __decorate([
    injectable(),
    __metadata("design:paramtypes", [CardTagsModel])
], CardTagsService);
export default CardTagsService;
