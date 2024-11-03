import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './../auth.service';
import { UnauthorizedException } from '@nestjs/common';
import { LocalStrategy } from './local-strategy';

describe('LocalStrategy', () => {
  let strategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      validateUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocalStrategy,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    strategy = module.get<LocalStrategy>(LocalStrategy);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('Valida el usuario', async () => {
    const mockUser = { username: 'testUser' };
    authService.validateUser = jest.fn().mockResolvedValue(mockUser);

    const result = await strategy.validate('testUser', 'testPass');
    expect(result).toEqual(mockUser);
    expect(authService.validateUser).toHaveBeenCalledWith('testUser', 'testPass');
  });

  it('Retorna una excepcion si no existe el usuario', async () => {
    authService.validateUser = jest.fn().mockResolvedValue(null);

    await expect(strategy.validate('invalidUser', 'wrongPass')).rejects.toThrow(UnauthorizedException);
    expect(authService.validateUser).toHaveBeenCalledWith('invalidUser', 'wrongPass');
  });
});
