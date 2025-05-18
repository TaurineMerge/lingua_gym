var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import 'dotenv/config';
import OpenAI from "openai";
import { HttpsProxyAgent } from 'https-proxy-agent';
import logger from '../utils/logger/Logger.js';
import 'dotenv/config';
import axios from 'axios';
class ContextTranslationIntegration {
    constructor() {
        const { PROXY_USER, PROXY_PASSWORD, PROXY_HOST, PROXY_PORT, PROXY_PROTOCOL, OPENAI_API_KEY, API_ENDPOINT, CATALOG_ID, IAM_TOKEN } = process.env;
        this.openaiApiKey = OPENAI_API_KEY || ``;
        this.httpAgent = new HttpsProxyAgent(`${PROXY_PROTOCOL}://${PROXY_USER}:${PROXY_PASSWORD}@${PROXY_HOST}:${PROXY_PORT}`);
        this.openai = new OpenAI({ apiKey: this.openaiApiKey, httpAgent: this.httpAgent });
        this.yandexApiEndpoint = API_ENDPOINT || ``;
        this.yandexApiKey = IAM_TOKEN || ``;
        this.yandexCatalogId = CATALOG_ID || ``;
    }
    translate(original, originalLanguageCode, targetLanguageCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios.post(this.yandexApiEndpoint, {
                    texts: [original],
                    targetLanguageCode: targetLanguageCode,
                    sourceLanguageCode: originalLanguageCode,
                    folderId: this.yandexCatalogId,
                    format: 'PLAIN_TEXT',
                }, {
                    headers: {
                        'Authorization': `Bearer ${this.yandexApiKey}`
                    }
                });
                return response.data.translations.map((item) => {
                    return item.text;
                });
            }
            catch (error) {
                logger.error('Translation failed: ', error);
                throw error;
            }
        });
    }
    translateContext(original, originalLanguageCode, targetLanguageCode, context) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const response = yield this.openai.chat.completions.create({
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
            }
            catch (error) {
                logger.error('Translation failed: ', error);
                throw error;
            }
        });
    }
    get translation() { return this.translation; }
    get context() { return this.context; }
    set translation(translation) { this.translation = translation; }
    set context(context) { this.context = context; }
}
export default ContextTranslationIntegration;
