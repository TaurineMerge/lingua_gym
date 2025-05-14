import { v4 as uuidv4 } from 'uuid';
class Meaning {
    constructor(_meaningId, _card, _meaning, _createdAt) {
        this._meaningId = _meaningId;
        this._card = _card;
        this._meaning = _meaning;
        this._createdAt = _createdAt;
        this._meaningId = _meaningId || uuidv4();
    }
    get meaningId() { return this._meaningId; }
    get card() { return this._card; }
    get meaning() { return this._meaning; }
    get createdAt() { return this._createdAt || null; }
    get meaningInfo() {
        return {
            dictionaryMeaningId: this._meaningId,
            cardId: this._card.cardId,
            meaning: this._meaning,
            createdAt: this._createdAt,
        };
    }
    set meaning(meaning) { this._meaning = meaning; }
}
export default Meaning;
