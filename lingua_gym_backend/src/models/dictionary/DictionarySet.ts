import User from "../access_management/User.js";
import { IDictionarySet, LanguageCode } from "../../database/interfaces/DbInterfaces.js";
import { Card } from "./dictionary.js";

class DictionarySet {
    private _dictionarySetId: string;
    private _owner: User;
    private _name: string;
    private _isPublic: boolean;
    private _languageCode: LanguageCode;
    private _description?: string | null;
    private _createdAt?: Date | null;
    private _cards?: Card[];
    constructor(
        set: IDictionarySet,
        owner: User,
        cards?: Card[],
    ) {
        this._dictionarySetId = set.dictionarySetId;
        this._owner = new User(owner);
        this._name = set.name;
        this._isPublic = set.isPublic;
        this._languageCode = set.languageCode;
        this._description = set.description;
        this._createdAt = set.createdAt;
        this._cards = cards;
    }

    get dictionarySetId(): string { return this._dictionarySetId; }
    get owner(): User { return this._owner; }
    get name(): string { return this._name; }
    get description(): string | null { if (!this._description) return null; return this._description; }
    get isPublic(): boolean { return this._isPublic; }
    get languageCode(): LanguageCode { return this._languageCode; }
    get createdAt(): Date | null { return this._createdAt || null; }
    get cards(): Card[] { return this._cards || []; }
    get set(): IDictionarySet {
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

    set owner(owner: User) { this._owner = owner; }
    set name(name: string) { this._name = name; }
    set description(description: string) { this._description = description; }
    set isPublic(isPublic: boolean) { this._isPublic = isPublic; }
    set languageCode(languageCode: LanguageCode) { this._languageCode = languageCode; }

    addCard(card: Card) { this._cards?.push(card); }
    removeCard(cardId: string) { this._cards = this._cards?.filter(card => card.cardId !== cardId); }
}

export default DictionarySet