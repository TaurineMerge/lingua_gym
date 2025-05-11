import { SetCardService } from '../../../../src/services/dictionary/dictionary.js';
import { SetCardModel } from '../../../../src/repositories/dictionary/dictionary.js';
import { DictionaryCard, SetCard } from '../../../../src/database/interfaces/DbInterfaces.js';
import logger from '../../../../src/utils/logger/Logger.js';

jest.mock('../../../../src/utils/logger/Logger.js', () => ({
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('SetCardsService', () => {
  let mockSetCardModel: jest.Mocked<SetCardModel>;
  let service: SetCardService;
  
  const mockSetId = 'test-set-id-123';
  const mockCardId = 'test-card-id-456';
  
  const mockSetCards: SetCard = {
    setId: mockSetId,
    cardId: mockCardId
  };
  
  const mockDictionaryCards: DictionaryCard[] = [
    {
      cardId: mockCardId,
      original: 'test',
      transcription: 'tɛst',
      pronunciation: 'protocol://some/url.com'
    }
  ];

  beforeEach(() => {
    mockSetCardModel = {
      addCardToSet: jest.fn(),
      removeCardFromSet: jest.fn(),
      getCardsBySet: jest.fn(),
    } as unknown as jest.Mocked<SetCardModel>;
    
    service = new SetCardService(mockSetCardModel);
    
    jest.clearAllMocks();
  });

  describe('addCardToSet', () => {
    test('should successfully add a card to a set and return the relation', async () => {
      mockSetCardModel.addCardToSet.mockResolvedValue(mockSetCards);
      
      const result = await service.addCardToSet(mockSetId, mockCardId);
      
      expect(mockSetCardModel.addCardToSet).toHaveBeenCalledWith(mockSetId, mockCardId);
      expect(result).toBe(mockSetCards);
    });
    
    test('should return false if setId is missing', async () => {
      const result = await service.addCardToSet('', mockCardId);
      
      expect(mockSetCardModel.addCardToSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should return false if cardId is missing', async () => {
      const result = await service.addCardToSet(mockSetId, '');
      
      expect(mockSetCardModel.addCardToSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle errors and return false when an exception occurs', async () => {
      mockSetCardModel.addCardToSet.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.addCardToSet(mockSetId, mockCardId);
      
      expect(mockSetCardModel.addCardToSet).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle when model returns a boolean value', async () => {
      mockSetCardModel.addCardToSet.mockResolvedValue(mockSetCards);
      
      const result = await service.addCardToSet(mockSetId, mockCardId);
      
      expect(mockSetCardModel.addCardToSet).toHaveBeenCalledWith(mockSetId, mockCardId);
      expect(result).toBe(mockSetCards);
    });
  });
  
  describe('removeCardFromSet', () => {
    test('should successfully remove a card from a set and return the relation', async () => {
      mockSetCardModel.removeCardFromSet.mockResolvedValue(mockSetCards);
      
      const result = await service.removeCardFromSet(mockSetId, mockCardId);
      
      expect(mockSetCardModel.removeCardFromSet).toHaveBeenCalledWith(mockSetId, mockCardId);
      expect(result).toBe(mockSetCards);
    });
    
    test('should return false if setId is missing', async () => {
      const result = await service.removeCardFromSet('', mockCardId);
      
      expect(mockSetCardModel.removeCardFromSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should return false if cardId is missing', async () => {
      const result = await service.removeCardFromSet(mockSetId, '');
      
      expect(mockSetCardModel.removeCardFromSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle errors and return false when an exception occurs', async () => {
      mockSetCardModel.removeCardFromSet.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.removeCardFromSet(mockSetId, mockCardId);
      
      expect(mockSetCardModel.removeCardFromSet).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle when model returns a boolean value', async () => {
      mockSetCardModel.removeCardFromSet.mockResolvedValue(mockSetCards);

      const result = await service.removeCardFromSet(mockSetId, mockCardId);
      
      expect(mockSetCardModel.removeCardFromSet).toHaveBeenCalledWith(mockSetId, mockCardId);
      expect(result).toBe(mockSetCards);
    });
  });
  
  describe('getCardsForSet', () => {
    test('should successfully retrieve cards for a set', async () => {
      mockSetCardModel.getCardsBySet.mockResolvedValue(mockDictionaryCards);
      
      const result = await service.getCardsForSet(mockSetId);
      
      expect(mockSetCardModel.getCardsBySet).toHaveBeenCalledWith(mockSetId);
      expect(result).toEqual(mockDictionaryCards);
    });
    
    test('should return empty array if setId is not provided', async () => {
      const result = await service.getCardsForSet('');
      
      expect(mockSetCardModel.getCardsBySet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
    
    test('should handle errors and return empty array when an exception occurs', async () => {
      mockSetCardModel.getCardsBySet.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.getCardsForSet(mockSetId);
      
      expect(mockSetCardModel.getCardsBySet).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});