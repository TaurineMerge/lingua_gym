interface DictionarySet {
    dictionarySetId: string;
    ownerId: string;
    name: string;
    description: string;
    isPublic: boolean;
    languageCode: string;
    createdAt?: Date;
}

export default DictionarySet;