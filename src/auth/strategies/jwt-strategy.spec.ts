import { Test, TestingModule } from '@nestjs/testing';
import constants from '../../shared/security/constants';
import { JwtStrategy } from './jwt-strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('Valida y retorna el usuario', async () => {
    const mockPayload = {
      sub: 1,
      username: 'testUser',
      roles: ['admin'],
    };

    const result = await strategy.validate(mockPayload);

    expect(result).toEqual({
      userId: 1,
      username: 'testUser',
      roles: ['admin'],
    });
  });

});
