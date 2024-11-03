import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockUserService = {
      findOne: jest.fn(), // Mock the findOne method
    };

    const mockJwtService = {
      sign: jest.fn(), // Mock the sign method
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Validar usuario correctamente', async () => {
    const mockUser = { username: 'testUser', password: 'testPass' };
    userService.findOne = jest.fn().mockResolvedValue(mockUser);

    const result = await service.validateUser('testUser', 'testPass');
    expect(result).toEqual({ username: 'testUser' });
  });

  it('Retorna un null si no sencuentra el usuario', async () => {
    userService.findOne = jest.fn().mockResolvedValue(null);

    const result = await service.validateUser('invalidUser', 'wrongPass');
    expect(result).toBeNull();
  });

  it('Retorna un token valido', async () => {
    const mockReq = { user: { username: 'testUser', id: 1, roles: ['admin'] } };
    jwtService.sign = jest.fn().mockReturnValue('testToken');

    const result = await service.login(mockReq);

    expect(result).toEqual({ token: 'testToken' });
    expect(jwtService.sign).toHaveBeenCalledWith(
      { username: 'testUser', sub: 1, roles: ['admin'] },
      { privateKey: expect.any(String), expiresIn: expect.any(String) }
    );
  });
});