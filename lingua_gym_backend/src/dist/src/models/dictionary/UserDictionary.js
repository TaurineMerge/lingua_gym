class UserDictionary {
    constructor(_userId, _sets) {
        this._userId = _userId;
        this._sets = _sets;
    }
    get userId() { return this._userId; }
    get userSets() { return this._sets; }
    addSet(set) { this._sets.push(set); }
    removeSet(setId) { this._sets = this._sets.filter(set => set.dictionarySetId !== setId); }
}
export default UserDictionary;
