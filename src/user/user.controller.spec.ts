import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { AuthService } from '../auth/auth.service';
import { LocalAuthGuard } from '../auth/guards/local-auth/local-auth.guard';
import { ExecutionContext } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    })
    .overrideGuard(LocalAuthGuard) 
    .useValue({
      canActivate: jest.fn((context: ExecutionContext) => true), 
    })
    .compile();

    controller = module.get<UserController>(UserController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService.login and return a token when login is called', async () => {
    const reqMock = {
      user: {
        username: 'testUser',
        id: 1,
        roles: ['user'],
      },
    };

    const mockToken = { token: 'test-jwt-token' };
    jest.spyOn(authService, 'login').mockResolvedValue(mockToken);

    const result = await controller.login(reqMock);
    expect(authService.login).toHaveBeenCalledWith(reqMock);
    expect(result).toEqual(mockToken);
  });
});
