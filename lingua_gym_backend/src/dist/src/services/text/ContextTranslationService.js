var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ContextTranslationIntegration from "../../integrations/ContextTranslationIntegration.js";
import logger from '../../utils/logger/Logger.js';
class ContextTranslationService {
    constructor() {
        this.contextTranslationIntegration = new ContextTranslationIntegration();
    }
    translate(original, originalLanguageCode, targetLanguageCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.contextTranslationIntegration.translate(original, originalLanguageCode, targetLanguageCode);
            }
            catch (error) {
                logger.error(`Error while translating text: ${error}`);
                throw error;
            }
        });
    }
    translateContext(original, originalLanguageCode, targetLanguageCode, context) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.contextTranslationIntegration.translateContext(original, originalLanguageCode, targetLanguageCode, context);
            }
            catch (error) {
                logger.error(`Error while translating text: ${error}`);
                throw error;
            }
        });
    }
}
export default ContextTranslationService;
