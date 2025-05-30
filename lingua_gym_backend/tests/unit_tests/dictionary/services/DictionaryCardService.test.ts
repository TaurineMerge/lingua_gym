import DictionaryCardService from '../../../../src/services/dictionary/DictionaryCardService.js';
import { DictionaryCardRepository } from '../../../../src/repositories/dictionary/dictionary.js';
import { IDictionaryCard, ICardTranslation, ICardMeaning, ICardExample } from '../../../../src/database/interfaces/DbInterfaces.js';
import logger from '../../../../src/utils/logger/Logger.js';

jest.mock('../../../../src/utils/logger/Logger.js', () => ({
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('DictionaryCardService', () => {
  let mockDictionaryCardModel: jest.Mocked<DictionaryCardRepository>;
  let service: DictionaryCardService;
  
  const mockCardId = 'test-card-id-123';
  
  const mockCard: IDictionaryCard = {
    cardId: mockCardId,
    original: 'test',
    transcription: 'tɛst',
    pronunciation: 'protocol://some/url.com'
  };
  
  const mockTranslations: ICardTranslation[] = [
    { 
      cardId: mockCardId,
      translationId: 'translation-123',
      translation: 'test',
    }
  ];
  
  const mockMeanings: ICardMeaning[] = [
    {
      cardId: mockCardId,
      dictionaryMeaningId: 'meaning-123',
      meaning: 'test'
    }
  ];
  
  const mockExamples: ICardExample[] = [
    {
      cardId: mockCardId,
      exampleId: 'example-123',
      example: 'test',
      translation: 'тест'
    }
  ];

  beforeEach(() => {
    mockDictionaryCardModel = {
      createCard: jest.fn(),
      getCardById: jest.fn(),
      removeCardById: jest.fn(),
    } as unknown as jest.Mocked<DictionaryCardRepository>;
    
    service = new DictionaryCardService(mockDictionaryCardModel);
    
    jest.clearAllMocks();
  });

  describe('createCard', () => {
    test('should successfully create a card and return ID', async () => {
      mockDictionaryCardModel.createCard.mockResolvedValue(mockCardId);
      
      const result = await service.createCard(mockCard, mockTranslations, mockMeanings, mockExamples);

      expect(mockDictionaryCardModel.createCard).toHaveBeenCalledWith(mockCard, mockTranslations, mockMeanings, mockExamples);
      expect(result).toBe(mockCardId);
    });
    
    test('should handle error and return null when exception occurs', async () => {
      mockDictionaryCardModel.createCard.mockRejectedValue(new Error('DB Error'));

      const result = await service.createCard(mockCard, mockTranslations, mockMeanings, mockExamples);
      
      expect(mockDictionaryCardModel.createCard).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
  
  describe('getCardById', () => {
    test('should successfully retrieve card by ID', async () => {
      mockDictionaryCardModel.getCardById.mockResolvedValue({
        cardId: mockCard.cardId,
        original: mockCard.original,
        transcription: mockCard.transcription,
        pronunciation: mockCard.pronunciation,
        translation: mockTranslations.map(t => t.translation) as string[],
        meaning: mockMeanings.map(m => m.meaning) as string[],
        example: mockExamples.map(e => e.example) as string[],
      });
      
      const result = await service.getCardById(mockCardId);
      
      expect(mockDictionaryCardModel.getCardById).toHaveBeenCalledWith(mockCardId);
      expect(result).toEqual({
        cardId: mockCard.cardId,
        original: mockCard.original,
        transcription: mockCard.transcription,
        pronunciation: mockCard.pronunciation,
        translation: mockTranslations.map(t => t.translation) as string[],
        meaning: mockMeanings.map(m => m.meaning) as string[],
        example: mockExamples.map(e => e.example) as string[],
      });
    });
    
    test('should return null when ID is not provided', async () => {
      const result = await service.getCardById('');
      
      expect(mockDictionaryCardModel.getCardById).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBeNull();
    });
    
    test('should handle error and return null when exception occurs', async () => {
      mockDictionaryCardModel.getCardById.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.getCardById(mockCardId);

      expect(mockDictionaryCardModel.getCardById).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
  
  describe('removeCardById', () => {
    test('should successfully remove card by ID', async () => {
      mockDictionaryCardModel.removeCardById.mockResolvedValue(true);
      
      const result = await service.removeCardById(mockCardId);
      
      expect(mockDictionaryCardModel.removeCardById).toHaveBeenCalledWith(mockCardId);
      expect(result).toBe(true);
    });
    
    test('should return false when ID is not provided', async () => {
      const result = await service.removeCardById('');
      
      expect(mockDictionaryCardModel.removeCardById).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle error and return false when exception occurs', async () => {
      mockDictionaryCardModel.removeCardById.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.removeCardById(mockCardId);
      
      expect(mockDictionaryCardModel.removeCardById).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});