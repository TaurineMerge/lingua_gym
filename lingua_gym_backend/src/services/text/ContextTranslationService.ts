import ContextTranslationIntegration from "../../integrations/ContextTranslationIntegration.js";
import logger from '../../utils/logger/Logger.js';

class ContextTranslationService {
    private contextTranslationIntegration: ContextTranslationIntegration;

    constructor() {
        this.contextTranslationIntegration = new ContextTranslationIntegration();
    }

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