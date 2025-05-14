class Example {
    constructor(_exampleId, _card, _example, _translation, _createdAt) {
        this._exampleId = _exampleId;
        this._card = _card;
        this._example = _example;
        this._translation = _translation;
        this._createdAt = _createdAt;
    }
    get exampleId() { return this._exampleId; }
    get card() { return this._card; }
    get example() { return this._example; }
    get translation() { return this._translation; }
    get createdAt() { return this._createdAt || null; }
    get exampleInfo() {
        return {
            exampleId: this._exampleId,
            cardId: this._card.cardId,
            example: this._example,
            translation: this._translation || null,
            createdAt: this._createdAt || null,
        };
    }
    set example(example) { this._example = example; }
    set translation(translation) { this._translation = translation; }
}
export default Example;
