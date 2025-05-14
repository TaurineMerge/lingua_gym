import { GeneralTag } from "./tag";
class SetTag extends GeneralTag {
    constructor(tagId, name, _set, createdAt) {
        super(tagId, name, createdAt);
        this._set = _set;
    }
    get set() { return this._set; }
}
export default SetTag;
