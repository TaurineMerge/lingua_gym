import IDictionaryTranslation from "../../database/interfaces/dictionary/ICardTranslation.js";
import { Card } from "./dictionary.js";

class CardTranslation {
    constructor(
        private _translationId: string,
        private _card: Card,
        private _translation: string,
        private _createdAt?: Date | null,
    ) {}

    get card(): Card { return this._card; }

    get translationInfo(): IDictionaryTranslation {
        return {
            translationId: this._translationId as string,
            cardId: this._card.cardId,
            translation: this._translation,
            createdAt: this._createdAt || null,
        };
    }

    get translationId(): string { return this._translationId as string; }
    get translation(): string { return this._translation; }
    get createdAt(): Date | null { return this._createdAt || null; }

    set translation(translation: string) { this._translation = translation; }
}

export default CardTranslation;