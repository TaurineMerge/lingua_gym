import User from "../access_management/User.js";
class DictionarySet {
    constructor(set, owner, cards) {
        if (owner.registrationMethod === undefined)
            throw new Error("User has no registration method");
        this._dictionarySetId = set.dictionarySetId;
        this._owner = new User(owner);
        this._name = set.name;
        this._isPublic = set.isPublic;
        this._languageCode = set.languageCode;
        this._description = set.description;
        this._rating = set.rating || 0;
        this._createdAt = set.createdAt;
        this._cards = cards;
    }
    get dictionarySetId() { return this._dictionarySetId; }
    get owner() { return this._owner; }
    get name() { return this._name; }
    get description() { if (!this._description)
        return null; return this._description; }
    get isPublic() { return this._isPublic; }
    get languageCode() { return this._languageCode; }
    get rating() { return this._rating; }
    get createdAt() { return this._createdAt || null; }
    get cards() { return this._cards || []; }
    get set() {
        return {
            dictionarySetId: this._dictionarySetId,
            ownerId: this._owner.userId,
            name: this._name,
            description: this._description,
            isPublic: this._isPublic,
            languageCode: this._languageCode,
            createdAt: this._createdAt,
        };
    }
    set owner(owner) { this._owner = owner; }
    set name(name) { this._name = name; }
    set description(description) { this._description = description; }
    set isPublic(isPublic) { this._isPublic = isPublic; }
    set languageCode(languageCode) { this._languageCode = languageCode; }
    addCard(card) { var _a; (_a = this._cards) === null || _a === void 0 ? void 0 : _a.push(card); }
    removeCard(cardId) { var _a; this._cards = (_a = this._cards) === null || _a === void 0 ? void 0 : _a.filter(card => card.cardId !== cardId); }
}
export default DictionarySet;
