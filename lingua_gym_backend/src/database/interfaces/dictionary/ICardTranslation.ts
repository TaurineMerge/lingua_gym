interface IDictionaryTranslation {
    translationId: string;
    cardId: string;
    translation: string;
    createdAt?: Date | null
}

export default IDictionaryTranslation;