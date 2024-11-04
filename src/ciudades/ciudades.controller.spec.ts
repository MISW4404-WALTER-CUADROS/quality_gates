import { Test, TestingModule } from '@nestjs/testing';
import { CiudadesController } from './ciudades.controller';
import { CiudadesService } from './ciudades.service';
import { CreateCiudadDto } from './dto/create-ciudad.dto';
import { UpdateCiudadDto } from './dto/update-ciudad.dto';
import { NotFoundException } from '@nestjs/common';

describe('CiudadesController', () => {
  let controller: CiudadesController;
  let service: CiudadesService;

  const mockCiudadesService = {
    create: jest.fn().mockImplementation((dto: CreateCiudadDto) => Promise.resolve({ ...dto, id: '123' })),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockImplementation((id: string) => {
      if (id === '123') {
        return Promise.resolve({ id, nombre: 'Ciudad Test' });
      }
      return Promise.reject(new NotFoundException('Ciudad no encontrada'));
    }),
    update: jest.fn().mockImplementation((id: string, dto: UpdateCiudadDto) => {
      if (id === '123') {
        return Promise.resolve({ id, ...dto });
      }
      return Promise.reject(new NotFoundException('Ciudad no encontrada'));
    }),
    remove: jest.fn().mockImplementation((id: string) => {
      if (id === '123') {
        return Promise.resolve();
      }
      return Promise.reject(new NotFoundException('Ciudad no encontrada'));
    }),
    asociarRestauranteACiudad: jest.fn().mockImplementation((ciudadId: string, restauranteId: string) => {
      if (ciudadId === '123' && restauranteId === '456') {
        return Promise.resolve({ ciudadId, restauranteId });
      }
      return Promise.reject(new NotFoundException('Ciudad o restaurante no encontrados'));
    }),
    eliminarRestauranteDeCiudad: jest.fn().mockImplementation((ciudadId: string, restauranteId: string) => {
      if (ciudadId === '123' && restauranteId === '456') {
        return Promise.resolve();
      }
      return Promise.reject(new NotFoundException('Ciudad o restaurante no encontrados'));
    }),
    obtenerRestaurantesDeCiudad: jest.fn().mockImplementation((ciudadId: string) => {
      if (ciudadId === '123') {
        return Promise.resolve([{ id: '456', nombre: 'Restaurante Test' }]);
      }
      return Promise.reject(new NotFoundException('Ciudad no encontrada'));
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CiudadesController],
      providers: [
        { provide: CiudadesService, useValue: mockCiudadesService },
      ],
    }).compile();

    controller = module.get<CiudadesController>(CiudadesController);
    service = module.get<CiudadesService>(CiudadesService);
  });

  describe('create', () => {
    it('should create a ciudad', async () => {
      const createCiudadDto: CreateCiudadDto = { nombre: 'Nueva Ciudad' };
      expect(await controller.create(createCiudadDto)).toEqual({ ...createCiudadDto, id: '123' });
    });
  });

  describe('findAll', () => {
    it('should return an array of ciudades', async () => {
      expect(await controller.findAll()).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a ciudad by id', async () => {
      expect(await controller.findOne('123')).toEqual({ id: '123', nombre: 'Ciudad Test' });
    });

    it('should throw NotFoundException for invalid id', async () => {
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a ciudad by id', async () => {
      const updateCiudadDto: UpdateCiudadDto = { nombre: 'Ciudad Actualizada' };
      expect(await controller.update('123', updateCiudadDto)).toEqual({ id: '123', ...updateCiudadDto });
    });

    it('should throw NotFoundException for invalid id', async () => {
      const updateCiudadDto: UpdateCiudadDto = { nombre: 'Ciudad Actualizada' };
      await expect(controller.update('999', updateCiudadDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a ciudad by id', async () => {
      await expect(controller.remove('123')).resolves.toBeUndefined();
    });

    it('should throw NotFoundException for invalid id', async () => {
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('asociarRestauranteACiudad', () => {
    it('should associate a restaurant to a city', async () => {
      expect(await controller.asociarRestauranteACiudad('123', '456')).toEqual({ ciudadId: '123', restauranteId: '456' });
    });

    it('should throw NotFoundException for invalid ids', async () => {
      await expect(controller.asociarRestauranteACiudad('999', '456')).rejects.toThrow(NotFoundException);
      await expect(controller.asociarRestauranteACiudad('123', '999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('eliminarRestauranteDeCiudad', () => {
    it('should remove a restaurant from a city', async () => {
      await expect(controller.eliminarRestauranteDeCiudad('123', '456')).resolves.toEqual({ message: 'Restaurante con ID 456 eliminado de la ciudad con ID 123' });
    });

    it('should throw NotFoundException for invalid ids', async () => {
      await expect(controller.eliminarRestauranteDeCiudad('999', '456')).rejects.toThrow(NotFoundException);
      await expect(controller.eliminarRestauranteDeCiudad('123', '999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('obtenerRestaurantesDeCiudad', () => {
    it('should return restaurants of a city', async () => {
      expect(await controller.obtenerRestaurantesDeCiudad('123')).toEqual([{ id: '456', nombre: 'Restaurante Test' }]);
    });

    it('should throw NotFoundException for invalid city id', async () => {
      await expect(controller.obtenerRestaurantesDeCiudad('999')).rejects.toThrow(NotFoundException);
    });
  });
});
