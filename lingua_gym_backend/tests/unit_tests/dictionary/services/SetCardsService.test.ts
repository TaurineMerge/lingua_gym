import { SetCardsService } from '../../../../src/services/dictionary/dictionary.js';
import { SetCardsModel } from '../../../../src/models/dictionary/dictionary.js';
import { DictionaryCard, SetCards } from '../../../../src/database/interfaces/DbInterfaces.js';
import logger from '../../../../src/utils/logger/Logger.js';

jest.mock('../../../../src/utils/logger/Logger.js', () => ({
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('SetCardsService', () => {
  let mockSetCardsModel: jest.Mocked<SetCardsModel>;
  let service: SetCardsService;
  
  const mockSetId = 'test-set-id-123';
  const mockCardId = 'test-card-id-456';
  
  const mockSetCards: SetCards = {
    setId: mockSetId,
    cardId: mockCardId
  };
  
  const mockDictionaryCards: DictionaryCard[] = [
    {
      dictionaryCardId: mockCardId,
      original: 'test',
      transcription: 'tɛst',
      pronunciation: 'protocol://some/url.com'
    }
  ];

  beforeEach(() => {
    mockSetCardsModel = {
      addCardToSet: jest.fn(),
      removeCardFromSet: jest.fn(),
      getCardsBySet: jest.fn(),
    } as unknown as jest.Mocked<SetCardsModel>;
    
    service = new SetCardsService(mockSetCardsModel);
    
    jest.clearAllMocks();
  });

  describe('addCardToSet', () => {
    test('should successfully add a card to a set and return the relation', async () => {
      mockSetCardsModel.addCardToSet.mockResolvedValue(mockSetCards);
      
      const result = await service.addCardToSet(mockSetId, mockCardId);
      
      expect(mockSetCardsModel.addCardToSet).toHaveBeenCalledWith(mockSetId, mockCardId);
      expect(result).toBe(mockSetCards);
    });
    
    test('should return false if setId is missing', async () => {
      const result = await service.addCardToSet('', mockCardId);
      
      expect(mockSetCardsModel.addCardToSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should return false if cardId is missing', async () => {
      const result = await service.addCardToSet(mockSetId, '');
      
      expect(mockSetCardsModel.addCardToSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle errors and return false when an exception occurs', async () => {
      mockSetCardsModel.addCardToSet.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.addCardToSet(mockSetId, mockCardId);
      
      expect(mockSetCardsModel.addCardToSet).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle when model returns a boolean value', async () => {
      mockSetCardsModel.addCardToSet.mockResolvedValue(mockSetCards);
      
      const result = await service.addCardToSet(mockSetId, mockCardId);
      
      expect(mockSetCardsModel.addCardToSet).toHaveBeenCalledWith(mockSetId, mockCardId);
      expect(result).toBe(mockSetCards);
    });
  });
  
  describe('removeCardFromSet', () => {
    test('should successfully remove a card from a set and return the relation', async () => {
      mockSetCardsModel.removeCardFromSet.mockResolvedValue(mockSetCards);
      
      const result = await service.removeCardFromSet(mockSetId, mockCardId);
      
      expect(mockSetCardsModel.removeCardFromSet).toHaveBeenCalledWith(mockSetId, mockCardId);
      expect(result).toBe(mockSetCards);
    });
    
    test('should return false if setId is missing', async () => {
      const result = await service.removeCardFromSet('', mockCardId);
      
      expect(mockSetCardsModel.removeCardFromSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should return false if cardId is missing', async () => {
      const result = await service.removeCardFromSet(mockSetId, '');
      
      expect(mockSetCardsModel.removeCardFromSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle errors and return false when an exception occurs', async () => {
      mockSetCardsModel.removeCardFromSet.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.removeCardFromSet(mockSetId, mockCardId);
      
      expect(mockSetCardsModel.removeCardFromSet).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle when model returns a boolean value', async () => {
      mockSetCardsModel.removeCardFromSet.mockResolvedValue(mockSetCards);

      const result = await service.removeCardFromSet(mockSetId, mockCardId);
      
      expect(mockSetCardsModel.removeCardFromSet).toHaveBeenCalledWith(mockSetId, mockCardId);
      expect(result).toBe(mockSetCards);
    });
  });
  
  describe('getCardsForSet', () => {
    test('should successfully retrieve cards for a set', async () => {
      mockSetCardsModel.getCardsBySet.mockResolvedValue(mockDictionaryCards);
      
      const result = await service.getCardsForSet(mockSetId);
      
      expect(mockSetCardsModel.getCardsBySet).toHaveBeenCalledWith(mockSetId);
      expect(result).toEqual(mockDictionaryCards);
    });
    
    test('should return empty array if setId is not provided', async () => {
      const result = await service.getCardsForSet('');
      
      expect(mockSetCardsModel.getCardsBySet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
    
    test('should handle errors and return empty array when an exception occurs', async () => {
      mockSetCardsModel.getCardsBySet.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.getCardsForSet(mockSetId);
      
      expect(mockSetCardsModel.getCardsBySet).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});