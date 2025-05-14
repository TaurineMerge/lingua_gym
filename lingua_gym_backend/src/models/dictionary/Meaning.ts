import IDictionaryMeaning from "../../database/interfaces/dictionary/ICardMeaning";
import { Card } from "./dictionary";
import { v4 as uuidv4 } from 'uuid';

class Meaning {
    constructor(
        private _meaningId: string,
        private _card: Card,
        private _meaning: string | null,
        private _createdAt?: Date,
    ) {
        this._meaningId = _meaningId || uuidv4();
    }

    get meaningId(): string { return this._meaningId as string; }
    get card(): Card { return this._card; }
    get meaning(): string | null { return this._meaning; }
    get createdAt(): Date | null { return this._createdAt || null; }

    get meaningInfo(): IDictionaryMeaning {
        return {
            dictionaryMeaningId: this._meaningId as string,
            cardId: this._card.cardId,
            meaning: this._meaning,
            createdAt: this._createdAt,
        };
    }

    set meaning(meaning: string | null) { this._meaning = meaning; }
}

export default Meaning;