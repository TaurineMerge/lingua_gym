import { DictionarySet } from './dictionary.js';

class UserDictionary {
    constructor(
        private _userId: string,
        private _sets: DictionarySet[],
    ) {}

    get userId(): string { return this._userId; }
    get userSets(): DictionarySet[] { return this._sets; }

    addSet(set: DictionarySet) { this._sets.push(set); }
    removeSet(setId: string) { this._sets = this._sets.filter(set => set.dictionarySetId !== setId); }
}

export default UserDictionary;