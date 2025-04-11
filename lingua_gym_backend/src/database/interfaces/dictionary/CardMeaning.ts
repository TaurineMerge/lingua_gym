interface DictionaryMeaning {
    dictionaryMeaningId: string;
    cardId: string;
    meaning: string | null;
    createdAt?: Date
}

export default DictionaryMeaning;