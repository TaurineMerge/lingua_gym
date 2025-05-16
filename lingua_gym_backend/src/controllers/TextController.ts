import { Request, Response } from "express";
import { container } from "tsyringe";
import logger from "../utils/logger/Logger.js";
import ContextTranslationService from "../services/text/ContextTranslationService.js";

class TextController {
    static async translate(req: Request, res: Response): Promise<void> {
        try {
            logger.info('Text translation attempt');
            const { original, targetLanguage, originalLanguage, context } = req.body;

            const contextTranslationService = container.resolve<ContextTranslationService>('ContextTranslationService');
            const translatedText = await contextTranslationService.translate(original, originalLanguage, targetLanguage, context);

            logger.info('Text translated successfully: ', { original, targetLanguage, originalLanguage, context, translatedText });
            res.status(201).json({ message: 'Text translated: ', original, targetLanguage, originalLanguage, context, translatedText });
        } catch (error) {
            logger.error({ error }, 'Text translation failed');
            res.status(400).json({ error: (error as Error).message });
        }
    }
}

export default TextController;