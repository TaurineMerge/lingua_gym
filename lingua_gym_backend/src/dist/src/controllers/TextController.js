var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { container } from "tsyringe";
import logger from "../utils/logger/Logger.js";
class TextController {
    static translate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                logger.info('Text translation attempt');
                const { original, targetLanguage, originalLanguage, context } = req.body;
                const contextTranslationService = container.resolve('ContextTranslationService');
                const translatedText = yield contextTranslationService.translate(original, originalLanguage, targetLanguage, context);
                logger.info('Text translated successfully: ', { original, targetLanguage, originalLanguage, context, translatedText });
                res.status(201).json({ message: 'Text translated: ', original, targetLanguage, originalLanguage, context, translatedText });
            }
            catch (error) {
                logger.error({ error }, 'Text translation failed');
                res.status(400).json({ error: error.message });
            }
        });
    }
}
export default TextController;
