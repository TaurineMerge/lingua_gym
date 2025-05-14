import { ICardExample, ICardMeaning, ICardTranslation, IDictionaryCard } from "../../database/interfaces/DbInterfaces.js";
import logger from "../../utils/logger/Logger.js";
import { Meaning, Example, CardTranslation } from "./dictionary.js";

class Card {
    private _cardId: string;
    private _original: string;
    private _pronunciation: string;
    private _translations: CardTranslation[];
    private _meanings: Meaning[];
    private _examples: Example[];
    private _transcription?: string | null;
    private _createdAt?: Date | null;

    constructor(
        generalCardData: IDictionaryCard,
        cardTranslations: Array<ICardTranslation>,
        cardMeanings: Array<ICardMeaning>,
        cardExamples: Array<ICardExample>,
    ) {
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

    get cardId(): string { return this._cardId; }
    get original(): string { return this._original; }
    get transcription(): string | null { return this._transcription || null; }
    get pronunciation(): string { return this._pronunciation; }
    get translations(): CardTranslation[] { return this._translations; }
    get meanings(): Meaning[] { return this._meanings; }
    get examples(): Example[] { return this._examples; }
    get createdAt(): Date | null { return this._createdAt || null; }

    get card(): IDictionaryCard & { examples: ICardExample[], meanings: ICardMeaning[], translations: ICardTranslation[] } {
        return {
            cardId: this._cardId,
            original: this._original,
            transcription: this?._transcription || null,
            pronunciation: this._pronunciation,
            createdAt: this?._createdAt || null,
            translations: this._translations.map(t => t.translationInfo),
            meanings: this._meanings.map(m => m.meaningInfo),
            examples: this._examples.map(e => e.exampleInfo),
        };
    }

    addTranslation(translation: CardTranslation) { this._translations.push(translation); }
    addMeaning(meaning: Meaning) { this._meanings.push(meaning); }
    addExample(example: Example) { this._examples.push(example); }

    removeTranslation(translationId: string) { this._translations = this._translations.filter(t => t.translationId !== translationId); }
    removeMeaning(meaningId: string) { this._meanings = this._meanings.filter(m => m.meaningId !== meaningId); }
    removeExample(exampleId: string) { this._examples = this._examples.filter(e => e.exampleId !== exampleId); }

    set original(original: string) { this._original = original; }
    set transcription(transcription: string) { this._transcription = transcription; }
    set pronunciation(pronunciation: string) { this._pronunciation = pronunciation; }
}

export default Card;