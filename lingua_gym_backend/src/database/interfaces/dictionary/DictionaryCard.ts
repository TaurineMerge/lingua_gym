interface DictionaryCard {
    dictionaryCardId: string;
    original: string;
    transcription: string;
    translation: Array<string>;
    meaning: Array<string>;
    example: Array<string>;
    pronunciation: string;
}

export default DictionaryCard;