interface IDictionaryMeaning {
    dictionaryMeaningId: string;
    cardId: string;
    meaning: string | null;
    createdAt?: Date
}

export default IDictionaryMeaning;