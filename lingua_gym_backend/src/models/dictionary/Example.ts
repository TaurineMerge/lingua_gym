import IDictionaryExample from "../../database/interfaces/dictionary/ICardExample.js";
import { Card } from "./dictionary.js";

class Example {
    constructor(
        private _exampleId: string,
        private _card: Card,
        private _example: string | null,
        private _translation: string | null,
        private _createdAt?: Date | null
    ) {}

    get exampleId(): string { return this._exampleId; }
    get card(): Card { return this._card; }
    get example(): string | null { return this._example; }
    get translation(): string | null { return this._translation; }
    get createdAt(): Date | null { return this._createdAt || null; }

    get exampleInfo(): IDictionaryExample {
        return {
            exampleId: this._exampleId,
            cardId: this._card.cardId,
            example: this._example,
            translation: this._translation || null,
            createdAt: this._createdAt || null,
        };
    }

    set example(example: string | null) { this._example = example; }
    set translation(translation: string | null) { this._translation = translation; }
}

export default Example;