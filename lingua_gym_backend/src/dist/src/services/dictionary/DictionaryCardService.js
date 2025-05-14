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
import { Card } from '../../models/dictionary/dictionary.js';
import { DictionaryCardRepository } from '../../repositories/dictionary/dictionary.js';
import logger from '../../utils/logger/Logger.js';
import { injectable, inject } from 'tsyringe';
let DictionaryCardService = class DictionaryCardService {
    constructor(cardRepository) {
        this.cardRepository = cardRepository;
    }
    createCard(generalCardData, cardTranslations, cardMeanings, cardExamples) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const card = new Card(generalCardData, cardTranslations, cardMeanings, cardExamples);
                return yield this.cardRepository.createCard(card.card);
            }
            catch (error) {
                logger.error({ error, generalCardData }, 'Failed to create dictionary card');
                return null;
            }
        });
    }
    getCardById(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cardId) {
                logger.warn('Card ID is required');
                return null;
            }
            try {
                return yield this.cardRepository.getCardById(cardId);
            }
            catch (error) {
                logger.error({ error, cardId }, 'Failed to fetch dictionary card');
                return null;
            }
        });
    }
    removeCardById(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cardId) {
                logger.warn('Missing card ID for deletion');
                return false;
            }
            try {
                return yield this.cardRepository.removeCardById(cardId);
            }
            catch (error) {
                logger.error({ error, cardId }, 'Failed to delete dictionary card');
                return false;
            }
        });
    }
};
DictionaryCardService = __decorate([
    injectable(),
    __param(0, inject('DictionaryCardModel')),
    __metadata("design:paramtypes", [DictionaryCardRepository])
], DictionaryCardService);
export default DictionaryCardService;
