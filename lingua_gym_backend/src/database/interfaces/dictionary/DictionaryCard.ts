interface DictionaryCard {
    cardId: string;
    original: string;
    transcription: string | null;
    pronunciation: string;
    createdAt?: Date
}

export default DictionaryCard;