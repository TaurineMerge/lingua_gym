class CardTranslation {
    constructor(_translationId, _card, _translation, _createdAt) {
        this._translationId = _translationId;
        this._card = _card;
        this._translation = _translation;
        this._createdAt = _createdAt;
    }
    get card() { return this._card; }
    get translationInfo() {
        return {
            translationId: this._translationId,
            cardId: this._card.cardId,
            translation: this._translation,
            createdAt: this._createdAt || null,
        };
    }
    get translationId() { return this._translationId; }
    get translation() { return this._translation; }
    get createdAt() { return this._createdAt || null; }
    set translation(translation) { this._translation = translation; }
}
export default CardTranslation;
