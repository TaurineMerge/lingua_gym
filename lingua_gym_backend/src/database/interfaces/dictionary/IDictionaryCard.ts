interface IDictionaryCard {
    cardId: string;
    original: string;
    transcription?: string | null;
    pronunciation: string;
    createdAt?: Date | null;
}

export default IDictionaryCard;