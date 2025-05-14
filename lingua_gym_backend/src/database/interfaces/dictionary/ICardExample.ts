interface IDictionaryExample {
    exampleId: string;
    cardId: string;
    example: string | null;
    translation: string | null;
    createdAt?: Date | null;
}

export default IDictionaryExample;