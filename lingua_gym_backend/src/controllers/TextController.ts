import { Request, Response } from "express";
import logger from "../utils/logger/Logger.js";
import ContextTranslationService from "../services/text/ContextTranslationService.js";

class TextController {
    static async translate(req: Request, res: Response): Promise<void> {
        try {
            logger.info('Text translation attempt');
            
            const { original, targetLanguageCode, originalLanguageCode, context } = req.body;
            const contextTranslationService = new ContextTranslationService();
            const translatedText = await contextTranslationService.translate(original, originalLanguageCode, targetLanguageCode, context);

            logger.info('Text translated successfully: ', { original, targetLanguageCode, originalLanguageCode, context, translatedText });
            res.status(201).json({ message: 'Text translated: ', original, targetLanguageCode, originalLanguageCode, context, translatedText });
        } catch (error) {
            logger.error({ error }, 'Text translation failed');
            res.status(400).json({ error: (error as Error).message });
        }
    }
}

export default TextController;