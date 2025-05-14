import { ITag } from "../../database/interfaces/DbInterfaces";

abstract class GeneralTag {
    constructor(
        private _tagId: string,
        private _name: string,
        private _createdAt?: Date | null
    ) {}

    get tagId(): string { return this._tagId; }
    get name(): string { return this._name; }
    get createdAt(): Date | null { return this._createdAt || null; }

    get tag(): ITag { return { tagId: this._tagId, name: this._name, createdAt: this._createdAt }; }

    set name(name: string) { this._name = name; }
}

export default GeneralTag;