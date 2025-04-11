interface DictionaryExample {
    exampleId: string;
    cardId: string;
    example: string | null;
    translation: string | null;
    createdAt?: Date;
}

export default DictionaryExample;