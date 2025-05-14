import logger from "../../utils/logger/Logger.js";
import { Meaning, Example, CardTranslation } from "./dictionary.js";
class Card {
    constructor(generalCardData, cardTranslations, cardMeanings, cardExamples) {
        this._cardId = generalCardData.cardId;
        this._original = generalCardData.original;
        logger.info({ cardId: this._cardId }, 'Creating dictionary card');
        if (!this._cardId || !this._original) {
            logger.error({ cardId: this._cardId }, 'Validation failed while creating dictionary card');
            throw new Error('Validation failed while creating dictionary card');
        }
        this._pronunciation = generalCardData.pronunciation;
        this._transcription = generalCardData.transcription || null;
        this._createdAt = generalCardData.createdAt || null;
        this._translations = cardTranslations.map(t => new CardTranslation(t.translationId, this, t.translation, t.createdAt));
        this._meanings = cardMeanings.map(m => new Meaning(m.dictionaryMeaningId, this, m.meaning, m.createdAt));
        this._examples = cardExamples.map(e => new Example(e.exampleId, this, e.example, e.translation, e.createdAt));
    }
    get cardId() { return this._cardId; }
    get original() { return this._original; }
    get transcription() { return this._transcription || null; }
    get pronunciation() { return this._pronunciation; }
    get translations() { return this._translations; }
    get meanings() { return this._meanings; }
    get examples() { return this._examples; }
    get createdAt() { return this._createdAt || null; }
    get card() {
        return {
            cardId: this._cardId,
            original: this._original,
            transcription: (this === null || this === void 0 ? void 0 : this._transcription) || null,
            pronunciation: this._pronunciation,
            createdAt: (this === null || this === void 0 ? void 0 : this._createdAt) || null,
            translations: this._translations.map(t => t.translationInfo),
            meanings: this._meanings.map(m => m.meaningInfo),
            examples: this._examples.map(e => e.exampleInfo),
        };
    }
    addTranslation(translation) { this._translations.push(translation); }
    addMeaning(meaning) { this._meanings.push(meaning); }
    addExample(example) { this._examples.push(example); }
    removeTranslation(translationId) { this._translations = this._translations.filter(t => t.translationId !== translationId); }
    removeMeaning(meaningId) { this._meanings = this._meanings.filter(m => m.meaningId !== meaningId); }
    removeExample(exampleId) { this._examples = this._examples.filter(e => e.exampleId !== exampleId); }
    set original(original) { this._original = original; }
    set transcription(transcription) { this._transcription = transcription; }
    set pronunciation(pronunciation) { this._pronunciation = pronunciation; }
}
export default Card;
