import DictionarySetService from '../../../../src/services/dictionary/DictionarySetService';
import { DictionarySetModel } from '../../../../src/repositories/dictionary/dictionary.js';
import { DictionarySet } from '../../../../src/database/interfaces/DbInterfaces.js';
import logger from '../../../../src/utils/logger/Logger.js';

jest.mock('../../../../src/utils/logger/Logger.js', () => ({
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('DictionarySetService', () => {
  let mockDictionarySetModel: jest.Mocked<DictionarySetModel>;
  let service: DictionarySetService;
  
  const mockSetId = 'test-set-id-123';
  
  const mockSet: DictionarySet = {
    dictionarySetId: mockSetId,
    name: 'Test Set',
    ownerId: 'owner-123',
    description: 'Test set description',
    isPublic: false,
    languageCode: 'en',
  };

  beforeEach(() => {
    mockDictionarySetModel = {
      createSet: jest.fn(),
      deleteSet: jest.fn(),
      getSetById: jest.fn(),
    } as unknown as jest.Mocked<DictionarySetModel>;
    
    service = new DictionarySetService(mockDictionarySetModel);
    
    jest.clearAllMocks();
  });

  describe('createSet', () => {
    test('should successfully create a set and return it', async () => {
      mockDictionarySetModel.createSet.mockResolvedValue(mockSet);
      
      const result = await service.createSet(mockSet);
      
      expect(mockDictionarySetModel.createSet).toHaveBeenCalledWith(mockSet);
      expect(result).toBe(mockSet);
    });
    
    test('should handle errors and return null when an exception occurs', async () => {
      mockDictionarySetModel.createSet.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.createSet(mockSet);
      
      expect(mockDictionarySetModel.createSet).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
  
  describe('deleteSet', () => {
    test('should successfully delete a set and return it', async () => {
      mockDictionarySetModel.deleteSet.mockResolvedValue(mockSet);
      
      const result = await service.deleteSet(mockSetId);
      
      expect(mockDictionarySetModel.deleteSet).toHaveBeenCalledWith(mockSetId);
      expect(result).toEqual(mockSet);
    });
    
    test('should return false if setId is not provided', async () => {
      const result = await service.deleteSet('');
      
      expect(mockDictionarySetModel.deleteSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle errors and return false when an exception occurs', async () => {
      mockDictionarySetModel.deleteSet.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.deleteSet(mockSetId);
      
      expect(mockDictionarySetModel.deleteSet).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle when model returns a boolean value', async () => {
      mockDictionarySetModel.deleteSet.mockResolvedValue(mockSet);
      
      const result = await service.deleteSet(mockSetId);
      
      expect(mockDictionarySetModel.deleteSet).toHaveBeenCalledWith(mockSetId);
      expect(result).toBe(mockSet);
    });
  });
  
  describe('getSetById', () => {
    test('should successfully retrieve a set by ID', async () => {
      mockDictionarySetModel.getSetById.mockResolvedValue(mockSet);
      
      const result = await service.getSetById(mockSetId);
      
      expect(mockDictionarySetModel.getSetById).toHaveBeenCalledWith(mockSetId);
      expect(result).toEqual(mockSet);
    });
    
    test('should handle errors and return null when an exception occurs', async () => {
      mockDictionarySetModel.getSetById.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.getSetById(mockSetId);
      
      expect(mockDictionarySetModel.getSetById).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});