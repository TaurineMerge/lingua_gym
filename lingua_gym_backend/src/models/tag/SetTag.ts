import { DictionarySet } from "../dictionary/dictionary";
import { GeneralTag } from "./tag";

class SetTag extends GeneralTag {
    constructor(
        tagId: string, 
        name: string, 
        private _set: DictionarySet,
        createdAt?: Date | null,    
    ) {
        super(tagId, name, createdAt);
    }

    get set(): DictionarySet { return this._set; }
}

export default SetTag;