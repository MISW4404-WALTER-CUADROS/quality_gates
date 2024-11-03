import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should return a user when findOne is called with an existing username', async () => {
    const username = 'admin';
    const user = await service.findOne(username);
    expect(user).toBeDefined();
    expect(user?.username).toBe(username);
    expect(user?.roles).toEqual(['admin']);
  });

  it('should return undefined when findOne is called with a non-existing username', async () => {
    const username = 'nonexistent';
    const user = await service.findOne(username);
    expect(user).toBeUndefined();
  });

  it('should return the correct user for a specific role', async () => {
    const username = 'writer';
    const user = await service.findOne(username);
    expect(user).toBeDefined();
    expect(user?.username).toBe(username);
    expect(user?.roles).toEqual(['writer']);
  });
  
});
