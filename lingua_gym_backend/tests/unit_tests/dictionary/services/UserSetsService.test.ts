import { UserSetService } from '../../../../src/services/dictionary/dictionary.js';
import { UserSetModel } from '../../../../src/models/dictionary/dictionary.js';
import { Permission, UserSet } from '../../../../src/database/interfaces/DbInterfaces.js';
import logger from '../../../../src/utils/logger/Logger.js';

jest.mock('../../../../src/utils/logger/Logger.js', () => ({
  warn: jest.fn(),
  error: jest.fn(),
}));

describe('UserSetsService', () => {
  let mockUserSetsModel: jest.Mocked<UserSetModel>;
  let service: UserSetService;
  
  const mockUserId = 'test-user-id-123';
  const mockSetId = 'test-set-id-456';
  const mockPermission: Permission = Permission.READ;
  
  const mockUserSet: UserSet = {
    userId: mockUserId,
    setId: mockSetId,
    permission: mockPermission
  };
  
  const mockUserSetsArray: UserSet[] = [
    mockUserSet,
    {
      userId: 'another-user-id',
      setId: mockSetId,
      permission: mockPermission,
    }
  ];

  beforeEach(() => {
    mockUserSetsModel = {
      addUserToSet: jest.fn(),
      removeUserFromSet: jest.fn(),
      getUserSets: jest.fn(),
      getUsersBySet: jest.fn(),
    } as unknown as jest.Mocked<UserSetModel>;
    
    service = new UserSetService(mockUserSetsModel);
    
    jest.clearAllMocks();
  });

  describe('addUserSet', () => {
    test('should successfully add a user to a set and return the relation', async () => {
      mockUserSetsModel.addUserToSet.mockResolvedValue(mockUserSet);
      
      const result = await service.addUserSet(mockUserId, mockSetId, mockPermission);
      
      expect(mockUserSetsModel.addUserToSet).toHaveBeenCalledWith(mockUserId, mockSetId, mockPermission);
      expect(result).toBe(mockUserSet);
    });
    
    test('should return false if userId is missing', async () => {
      const result = await service.addUserSet('', mockSetId, mockPermission);
      
      expect(mockUserSetsModel.addUserToSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should return false if setId is missing', async () => {
      const result = await service.addUserSet(mockUserId, '', mockPermission);
      
      expect(mockUserSetsModel.addUserToSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should return false if permission is missing', async () => {
      const result = await service.addUserSet(mockUserId, mockSetId, null as unknown as Permission);

      expect(mockUserSetsModel.addUserToSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle errors and return false when an exception occurs', async () => {
      mockUserSetsModel.addUserToSet.mockRejectedValue(new Error('DB Error'));

      const result = await service.addUserSet(mockUserId, mockSetId, mockPermission);

      expect(mockUserSetsModel.addUserToSet).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle when model returns a boolean value', async () => {
      mockUserSetsModel.addUserToSet.mockResolvedValue(mockUserSet);
      
      const result = await service.addUserSet(mockUserId, mockSetId, mockPermission);
      
      expect(mockUserSetsModel.addUserToSet).toHaveBeenCalledWith(mockUserId, mockSetId, mockPermission);
      expect(result).toBe(mockUserSet);
    });
  });
  
  describe('removeUserSet', () => {
    test('should successfully remove a user from a set and return the relation', async () => {
      mockUserSetsModel.removeUserFromSet.mockResolvedValue(mockUserSet);
      
      const result = await service.removeUserSet(mockUserId, mockSetId);
      
      expect(mockUserSetsModel.removeUserFromSet).toHaveBeenCalledWith(mockUserId, mockSetId);
      expect(result).toBe(mockUserSet);
    });
    
    test('should return false if userId is missing', async () => {
      const result = await service.removeUserSet('', mockSetId);

      expect(mockUserSetsModel.removeUserFromSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should return false if setId is missing', async () => {
      const result = await service.removeUserSet(mockUserId, '');
      
      expect(mockUserSetsModel.removeUserFromSet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle errors and return false when an exception occurs', async () => {
      mockUserSetsModel.removeUserFromSet.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.removeUserSet(mockUserId, mockSetId);
      
      expect(mockUserSetsModel.removeUserFromSet).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toBe(false);
    });
    
    test('should handle when model returns a boolean value', async () => {
      mockUserSetsModel.removeUserFromSet.mockResolvedValue(mockUserSet);
      
      const result = await service.removeUserSet(mockUserId, mockSetId);
      
      expect(mockUserSetsModel.removeUserFromSet).toHaveBeenCalledWith(mockUserId, mockSetId);
      expect(result).toBe(mockUserSet);
    });
  });
  
  describe('getUserSets', () => {
    test('should successfully retrieve sets for a user', async () => {
      mockUserSetsModel.getUserSets.mockResolvedValue(mockUserSetsArray);
      
      const result = await service.getUserSets(mockUserId);
      
      expect(mockUserSetsModel.getUserSets).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockUserSetsArray);
    });
    
    test('should return empty array if userId is not provided', async () => {
      const result = await service.getUserSets('');

      expect(mockUserSetsModel.getUserSets).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
    
    test('should handle errors and return empty array when an exception occurs', async () => {
      mockUserSetsModel.getUserSets.mockRejectedValue(new Error('DB Error'));
      
      const result = await service.getUserSets(mockUserId);
      
      expect(mockUserSetsModel.getUserSets).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
  
  describe('getUsersForSet', () => {
    test('should successfully retrieve users for a set', async () => {
      mockUserSetsModel.getUsersBySet.mockResolvedValue(mockUserSetsArray);
      
      const result = await service.getUsersForSet(mockSetId);
      
      expect(mockUserSetsModel.getUsersBySet).toHaveBeenCalledWith(mockSetId);
      expect(result).toEqual(mockUserSetsArray);
    });
    
    test('should return empty array if setId is not provided', async () => {
      const result = await service.getUsersForSet('');

      expect(mockUserSetsModel.getUsersBySet).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
    
    test('should handle errors and return empty array when an exception occurs', async () => {
      mockUserSetsModel.getUsersBySet.mockRejectedValue(new Error('DB Error'));
 
      const result = await service.getUsersForSet(mockSetId);

      expect(mockUserSetsModel.getUsersBySet).toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});