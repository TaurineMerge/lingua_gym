import 'reflect-metadata';
import { inject, injectable } from "tsyringe";
import ContextTranslationIntegration from "../../integrations/ContextTranslationIntegration.js";
import logger from '../../utils/logger/Logger.js';

@injectable()
class ContextTranslationService {
    constructor(
        @inject('ContextTranslationIntegration') private contextTranslationIntegration: ContextTranslationIntegration,
    ) {}

    async translate(original: string, originalLanguageCode: string, targetLanguageCode: string, context?: string): Promise<string | null> {
        try {
            return await this.contextTranslationIntegration.translate(original, originalLanguageCode, targetLanguageCode, context);
        } catch (error) {
            logger.error(`Error while translating text: ${error}`);
            throw error;
        }
    }
}

export default ContextTranslationService;