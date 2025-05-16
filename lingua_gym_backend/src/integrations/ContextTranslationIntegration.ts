import 'dotenv/config';
import OpenAI from "openai";
import { HttpsProxyAgent } from 'https-proxy-agent';
import logger from '../utils/logger/Logger.js';

class ContextTranslationIntegration {
    private apiKey: string;
    private httpAgent: HttpsProxyAgent<string>;
    private openai: OpenAI;
    
    constructor() { 
        const { PROXY_USER, PROXY_PASSWORD, PROXY_HOST, PROXY_PORT, PROXY_PROTOCOL, OPENAI_API_KEY } = process.env;

        this.apiKey = OPENAI_API_KEY || ``;
        this.httpAgent = new HttpsProxyAgent(`${PROXY_PROTOCOL}://${PROXY_USER}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`);
        this.openai = new OpenAI({ apiKey: this.apiKey, httpAgent: this.httpAgent });
    }

    async translate(original: string, originalLanguageCode: string, targetLanguageCode: string, context?: string): Promise<string | null> {
        try {
            const model = process.env.OPENAI_MODEL || '';

            const userPrompt = context 
                ? `Translate the following text: ${original}. 
                The context is: ${context}. Original language: ${originalLanguageCode}. 
                Target language: ${targetLanguageCode}.` 
                : `Translate the following text: ${original}. 
                Orgiginal language: ${originalLanguageCode}. 
                Target language: ${targetLanguageCode}.`;
            const systemPrompt = `You are a smart translator. You will translate the text from one language into another considering the context.`;
            const response = await this.openai.chat.completions.create({
                model: model,
                messages: [
            {
                role: 'system',
                content: systemPrompt,
            },
            {
                role: 'user',
                content: userPrompt,
            },
            ],
            temperature: 0.7,
            max_completion_tokens: 20
            });

            return response.choices[0].message.content;
        } catch (error) {
            logger.error('Translation failed: ', error);
            throw error;
        }
    }

    get translation() { return this.translation; }
    get context() { return this.context; }

    set translation(translation: string) { this.translation = translation; }
    set context(context: string) { this.context = context; }
}

export default ContextTranslationIntegration;