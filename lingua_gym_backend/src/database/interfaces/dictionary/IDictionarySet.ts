enum LanguageCode {
    ENGLISH = 'en',
    SPANISH = 'es',
    FRENCH = 'fr',
    GERMAN = 'de',
    ITALIAN = 'it',
    PORTUGUESE = 'pt',
    RUSSIAN = 'ru',
    CHINESE = 'zh',
    JAPANESE = 'ja',
    KOREAN = 'ko',
    HINDI = 'hi',
    ARABIC = 'ar',
    HEBREW = 'he',
    THAI = 'th',
    VIETNAMESE = 'vi',
    POLISH = 'pl',
    CATALAN = 'ca',
    CZECH = 'cs',
    DANISH = 'da',
    DUTCH = 'nl',
    FINNISH = 'fi',
    HUNGARIAN = 'hu',
    NORWEGIAN = 'no',
    SWEDISH = 'sv'
}

interface IDictionarySet {
    dictionarySetId: string;
    ownerId: string;
    name: string;
    description?: string | null;
    isPublic: boolean;
    languageCode: LanguageCode;
    createdAt?: Date | null;
}

export { IDictionarySet, LanguageCode };