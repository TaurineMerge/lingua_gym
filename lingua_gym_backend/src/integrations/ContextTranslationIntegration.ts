import 'dotenv/config';
import OpenAI from "openai";
import { HttpsProxyAgent } from 'https-proxy-agent';
import logger from '../utils/logger/Logger.js';
import 'dotenv/config';
import axios from 'axios';

class ContextTranslationIntegration {
    private openaiApiKey: string;
    private httpAgent: HttpsProxyAgent<string>;
    private openai: OpenAI;
    private yandexApiEndpoint: string;
    private yandexApiKey: string;
    private yandexCatalogId: string;
    
    constructor() { 
        const { PROXY_USER, PROXY_PASSWORD, PROXY_HOST, PROXY_PORT, PROXY_PROTOCOL, OPENAI_API_KEY, API_ENDPOINT, CATALOG_ID, IAM_TOKEN } = process.env;

        this.openaiApiKey = OPENAI_API_KEY || ``;
        this.httpAgent = new HttpsProxyAgent(`${PROXY_PROTOCOL}://${PROXY_USER}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`);
        this.openai = new OpenAI({ apiKey: this.openaiApiKey, httpAgent: this.httpAgent });

        this.yandexApiEndpoint = API_ENDPOINT || ``;
        this.yandexApiKey = IAM_TOKEN || ``;
        this.yandexCatalogId = CATALOG_ID || ``;
    }

    async translate(original: string, originalLanguageCode: string, targetLanguageCode: string): Promise<string | null> {
        try {
            const response = await axios.post(this.yandexApiEndpoint, {
                texts: [ original ],
                targetLanguageCode: targetLanguageCode,
                sourceLanguageCode: originalLanguageCode,
                folderId: this.yandexCatalogId,
                format: 'PLAIN_TEXT',
            }, 
            {
                headers: {
                    'Authorization': `Bearer ${this.yandexApiKey}`
                }
            });
            return response.data.translations.map((item: { text: string }) => {
                return item.text
            })
        } catch (error) {
            logger.error('Translation failed: ', error);
            throw error;
        }
    }

    async translateContext(original: string, originalLanguageCode: string, targetLanguageCode: string, context: string): Promise<string | null> {
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