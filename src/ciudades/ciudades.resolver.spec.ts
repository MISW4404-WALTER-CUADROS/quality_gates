import { Test, TestingModule } from '@nestjs/testing';
import { CiudadesResolver } from './ciudades.resolver';
import { CiudadesService } from './ciudades.service';
import { Ciudad } from './entities/ciudad.entity';
import { CreateCiudadDto } from './dto/create-ciudad.dto';

const ciudadMock: Ciudad = {
  id: 'mock-uuid',
  nombre: 'Madrid',
  restaurantes: [],
  idPais: 'pais-mock-uuid',
};

describe('CiudadesResolver', () => {
  let ciudadesResolver: CiudadesResolver;
  let ciudadesService: CiudadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CiudadesResolver,
        {
          provide: CiudadesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([ciudadMock]),
            findOne: jest.fn().mockResolvedValue(ciudadMock),
            create: jest.fn().mockResolvedValue(ciudadMock),
            update: jest.fn().mockResolvedValue(ciudadMock),
            remove: jest.fn().mockResolvedValue('mock-uuid'),
            asociarRestauranteACiudad: jest.fn().mockResolvedValue(ciudadMock),
            eliminarRestauranteDeCiudad: jest.fn().mockResolvedValue(ciudadMock),
          },
        },
      ],
    }).compile();

    ciudadesResolver = module.get<CiudadesResolver>(CiudadesResolver);
    ciudadesService = module.get<CiudadesService>(CiudadesService);
  });

  it('debería estar definido', () => {
    expect(ciudadesResolver).toBeDefined();
  });

  describe('ciudades', () => {
    it('debería devolver una lista de ciudades', async () => {
      expect(await ciudadesResolver.ciudades()).toEqual([ciudadMock]);
      expect(ciudadesService.findAll).toHaveBeenCalled();
    });
  });

  describe('ciudad', () => {
    it('debería devolver una ciudad por ID', async () => {
      expect(await ciudadesResolver.ciudad('mock-uuid')).toEqual(ciudadMock);
      expect(ciudadesService.findOne).toHaveBeenCalledWith('mock-uuid');
    });
  });

  describe('createCiudad', () => {
    it('debería crear una nueva ciudad', async () => {
      const createCiudadDto: CreateCiudadDto = {
        nombre: 'Barcelona',
      };

      expect(await ciudadesResolver.createCiudad(createCiudadDto)).toEqual(ciudadMock);
      expect(ciudadesService.create).toHaveBeenCalledWith(createCiudadDto);
    });
  });

  describe('updateCiudad', () => {
    it('debería actualizar una ciudad existente', async () => {
      const updateCiudadDto: CreateCiudadDto = {
        nombre: 'Madrid Actualizada',
      };

      expect(await ciudadesResolver.updateCiudad('mock-uuid', updateCiudadDto)).toEqual(ciudadMock);
      expect(ciudadesService.update).toHaveBeenCalledWith('mock-uuid', updateCiudadDto);
    });
  });

  describe('deleteCiudad', () => {
    it('debería eliminar una ciudad', async () => {
      expect(await ciudadesResolver.deleteCiudad('mock-uuid')).toBe('mock-uuid');
      expect(ciudadesService.remove).toHaveBeenCalledWith('mock-uuid');
    });
  });

  describe('agregarRestauranteACiudad', () => {
    it('debería agregar un restaurante a una ciudad', async () => {
      const restauranteId = 'restaurante-mock-uuid';
      expect(await ciudadesResolver.agregarRestauranteACiudad('mock-uuid', restauranteId)).toEqual(ciudadMock);
      expect(ciudadesService.asociarRestauranteACiudad).toHaveBeenCalledWith('mock-uuid', restauranteId);
    });
  });

  describe('removeRestauranteDeCiudad', () => {
    it('debería eliminar un restaurante de una ciudad', async () => {
      const restauranteId = 'restaurante-mock-uuid';
      expect(await ciudadesResolver.removeRestauranteDeCiudad('mock-uuid', restauranteId)).toEqual(ciudadMock);
      expect(ciudadesService.eliminarRestauranteDeCiudad).toHaveBeenCalledWith('mock-uuid', restauranteId);
    });
  });

  describe('restaurantesDeCiudad', () => {
    it('debería devolver los restaurantes de una ciudad', async () => {
      const restaurantes = await ciudadesResolver.restaurantesDeCiudad('mock-uuid');
      expect(restaurantes).toEqual(ciudadMock.restaurantes);
      expect(ciudadesService.findOne).toHaveBeenCalledWith('mock-uuid');
    });
  });
});
