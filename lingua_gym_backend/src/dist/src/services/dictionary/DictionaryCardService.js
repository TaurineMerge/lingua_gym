var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v4 as uuidv4 } from 'uuid';
import logger from '../../utils/logger/Logger.js';
class DictionaryCardService {
    constructor(dictionaryCardModel) {
        this.dictionaryCardModel = dictionaryCardModel;
    }
    createCard(cardGeneralData, cardTranslations, cardMeanings, cardExamples) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateCardData(cardGeneralData);
            const cardId = uuidv4();
            logger.info({ cardId, cardGeneralData }, 'Creating new dictionary card');
            const createdId = yield this.dictionaryCardModel.createCard(Object.assign(Object.assign({}, cardGeneralData), { dictionaryCardId: cardId }), cardTranslations, cardMeanings, cardExamples);
            logger.info({ cardId: createdId }, 'Dictionary card created successfully');
            return createdId;
        });
    }
    getCardById(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info({ cardId }, 'Fetching dictionary card');
            const card = yield this.dictionaryCardModel.getCardById(cardId);
            if (!card) {
                logger.warn({ cardId }, 'Dictionary card not found');
                return null;
            }
            logger.info({ cardId }, 'Dictionary card fetched successfully');
            return card;
        });
    }
    deleteCard(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info({ cardId }, 'Attempting to delete dictionary card');
            const deleted = yield this.dictionaryCardModel.removeCardById(cardId);
            if (deleted) {
                logger.info({ cardId }, 'Dictionary card deleted successfully');
            }
            else {
                logger.warn({ cardId }, 'Dictionary card not found or already deleted');
            }
            return deleted;
        });
    }
    addTagToCard(cardId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info({ cardId, tagId }, 'Adding tag to dictionary card');
            const success = yield this.dictionaryCardModel.addTagToCard(cardId, tagId);
            if (success) {
                logger.info({ cardId, tagId }, 'Tag added successfully');
            }
            else {
                logger.warn({ cardId, tagId }, 'Failed to add tag (maybe already added)');
            }
            return success;
        });
    }
    removeTagFromCard(cardId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info({ cardId, tagId }, 'Removing tag from dictionary card');
            const success = yield this.dictionaryCardModel.removeTagFromCard(cardId, tagId);
            if (success) {
                logger.info({ cardId, tagId }, 'Tag removed successfully');
            }
            else {
                logger.warn({ cardId, tagId }, 'Failed to remove tag (maybe it was not assigned)');
            }
            return success;
        });
    }
    getTagsForCard(cardId) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info({ cardId }, 'Fetching tags for dictionary card');
            return yield this.dictionaryCardModel.getTagsForCard(cardId);
        });
    }
    validateCardData(cardData) {
        if (!cardData.original.trim())
            throw new Error('Original field cannot be empty');
    }
}
export default DictionaryCardService;
