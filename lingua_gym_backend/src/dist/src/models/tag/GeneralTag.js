class GeneralTag {
    constructor(_tagId, _name, _createdAt) {
        this._tagId = _tagId;
        this._name = _name;
        this._createdAt = _createdAt;
    }
    get tagId() { return this._tagId; }
    get name() { return this._name; }
    get createdAt() { return this._createdAt || null; }
    get tag() { return { tagId: this._tagId, name: this._name, createdAt: this._createdAt }; }
    set name(name) { this._name = name; }
}
export default GeneralTag;
