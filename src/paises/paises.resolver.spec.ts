import { Test, TestingModule } from '@nestjs/testing';

import { Pais } from './entities/pais.entity';
import { CreatePaisDto } from './dto/create-pais.dto';
import { PaisesResolver } from './paises.resolver';
import { PaisesService } from './paises.service';
import { Ciudad } from '../ciudades/entities/ciudad.entity';
import { Cultura } from '../culturas/entities/cultura.entity';

const ciudadMock: Ciudad = {
  id: 'ciudad-mock-uuid',
  nombre: 'Madrid',
  restaurantes: [],
  idPais: 'mock-uuid',
};

const culturaMock: Cultura = {
  id: 'cultura-mock-uuid',
  nombre: 'Flamenco',
  descripcion: 'Descripción de la cultura',
  paises: [],
  restaurantes: [],
  recetas: [],
  productos: [],
};

const paisMock: Pais = {
  id: 'mock-uuid',
  nombre: 'España',
  ciudades: [ciudadMock],
  culturas: [culturaMock],
};

describe('PaisesResolver', () => {
  let paisesResolver: PaisesResolver;
  let paisesService: PaisesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaisesResolver,
        {
          provide: PaisesService,
          useValue: {
            create: jest.fn().mockResolvedValue(paisMock),
            update: jest.fn().mockResolvedValue(paisMock),
            remove: jest.fn().mockResolvedValue('mock-uuid'),
            findOne: jest.fn().mockResolvedValue(paisMock),
          },
        },
      ],
    }).compile();

    paisesResolver = module.get<PaisesResolver>(PaisesResolver);
    paisesService = module.get<PaisesService>(PaisesService);
  });

  it('debería ser definido', () => {
    expect(paisesResolver).toBeDefined();
  });

  describe('create', () => {
    it('debería crear un nuevo país', async () => {
      const createPaisDto: CreatePaisDto = {
        nombre: 'Italia',
      };

      expect(await paisesResolver.createPais(createPaisDto)).toBe(paisMock);
      expect(paisesService.create).toHaveBeenCalledWith(createPaisDto);
    });
  });

  describe('remove', () => {
    it('debería eliminar un país', async () => {
      expect(await paisesResolver.deletePais('mock-uuid')).toBe('mock-uuid'); // Cambiado a 'mock-uuid'
      expect(paisesService.remove).toHaveBeenCalledWith('mock-uuid');
    });
  });
});
